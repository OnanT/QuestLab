from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from pathlib import Path
import uuid
from datetime import datetime

import models, schemas
from dependencies import get_db, get_current_user

router = APIRouter(
    tags=["media"],
)


@router.post("/upload-media")
async def upload_media(
    file: UploadFile = File(...),
    lesson_id: Optional[int] = None,
    game_id: Optional[int] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in ['teacher', 'parent', 'admin']:
        raise HTTPException(
            status_code=403, detail="Not authorized to upload media")

    allowed_types = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'audio/mpeg', 'audio/wav', 'audio/ogg',
        'application/pdf', 'video/mp4'
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, detail=f"File type {file.content_type} not allowed")

    UPLOAD_DIR = Path("frontend/uploads")
    UPLOAD_DIR.mkdir(exist_ok=True, parents=True)

    timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
    file_ext = Path(file.filename).suffix
    unique_filename = f"{timestamp}_{current_user.id}_{uuid.uuid4().hex[:8]}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename

    try:
        with file_path.open("wb") as buffer:
            while chunk := await file.read(8192):
                buffer.write(chunk)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    file_category = 'other'
    if file.content_type.startswith('image/'):
        file_category = 'image'
    elif file.content_type.startswith('audio/'):
        file_category = 'audio'
    elif file.content_type.startswith('video/'):
        file_category = 'video'
    elif file.content_type == 'application/pdf':
        file_category = 'document'

    media = models.Media(
        filename=unique_filename,
        filetype=file.content_type,
        url=f"/uploads/{unique_filename}",
        file_category=file_category,
        lesson_id=lesson_id,
        game_id=game_id,
        uploaded_by=current_user.id
    )

    try:
        db.add(media)
        db.commit()
        db.refresh(media)
    except IntegrityError:
        db.rollback()
        file_path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=400, detail="Failed to save media record")

    return {
        "message": "File uploaded successfully",
        "media_id": media.id,
        "filename": media.filename,
        "url": f"/uploads/{unique_filename}",
        "full_url": f"http://localhost:5173/uploads/{unique_filename}",
        "filetype": media.filetype,
        "category": file_category
    }


@router.get("/all-media", response_model=List[dict])
def get_all_media(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in ['teacher', 'parent', 'admin']:
        raise HTTPException(
            status_code=403, detail="Not authorized to view media")
            
    query = db.query(models.Media)
    # If not admin, only show user's own media
    if current_user.role != 'admin':
        query = query.filter(models.Media.uploaded_by == current_user.id)
        
    media_list = query.order_by(models.Media.uploaded_at.desc()).all()
    
    return [
        {
            "id": media.id,
            "filename": media.filename,
            "filetype": media.filetype,
            "url": media.url,
            "category": media.file_category,
            "uploaded_at": media.uploaded_at
        }
        for media in media_list
    ]


@router.get("/media/{lesson_id}", response_model=List[dict])
def get_lesson_media(lesson_id: int, db: Session = Depends(get_db)):
    media_list = db.query(models.Media).filter(
        models.Media.lesson_id == lesson_id).all()
    return [
        {
            "id": media.id,
            "filename": media.filename,
            "filetype": media.filetype,
            "url": media.url,
            "uploaded_at": media.uploaded_at
        }
        for media in media_list
    ]
