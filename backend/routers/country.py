from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List

import models
import schemas
from dependencies import get_db, get_current_user

router = APIRouter(
    prefix="/country",
    tags=["country"],
)


@router.get("", response_model=List[schemas.CountryOut])
def get_country(db: Session = Depends(get_db)):
    """Get all countries"""
    countries = db.query(models.Country).all()
    island_data = []
    flag_map = {
        "Barbados": "🇧🇧",
        "Trinidad and Tobago": "🇹🇹",
        "Jamaica": "🇯🇲",
        "Guyana": "🇬🇾",
    }
    for country in countries:
        island_data.append({
            "id": country.id,
            "name": country.name,
            "flag_emoji": flag_map.get(country.name, "🏝️")
        })
    return island_data


@router.post("", response_model=schemas.CountryOut, status_code=status.HTTP_201_CREATED)
def create_island(
    country: schemas.CountryCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new country/island - Admin only"""
    if current_user.role != 'admin':
        raise HTTPException(
            status_code=403, detail="Only admins can create country")

    db_country = models.Country(name=country.name)

    try:
        db.add(db_country)
        db.commit()
        db.refresh(db_country)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create island")

    return {
        "id": db_country.id,
        "name": db_country.name,
        "flag_emoji": country.flag_emoji
    }


@router.delete("/{island_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_island(
    island_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an island - Admin only"""
    if current_user.role != 'admin':
        raise HTTPException(
            status_code=403, detail="Only admins can delete country")

    island = db.query(models.Country).filter(
        models.Country.id == island_id).first()
    if not island:
        raise HTTPException(status_code=404, detail="Island not found")

    try:
        db.delete(island)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=f"Failed to delete island: {str(e)}")

    return None
