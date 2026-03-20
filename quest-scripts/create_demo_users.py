# create_demo_users.py
from main import SessionLocal, User, get_password_hash

db = SessionLocal()

# Create demo users if they don't exist
demo_users = [
    {"username": "admin", "email": "admin@questlab.edu", "password": "admin123", "role": "admin"},
    {"username": "teacher", "email": "teacher@questlab.edu", "password": "teacher123", "role": "teacher"},
    {"username": "parent", "email": "parent@questlab.edu", "password": "parent123", "role": "parent"},
    {"username": "student", "email": "student@questlab.edu", "password": "student123", "role": "student"},
]

for user_data in demo_users:
    existing = db.query(User).filter(User.username == user_data["username"]).first()
    if not existing:
        hashed_password = get_password_hash(user_data["password"])
        user = User(
            username=user_data["username"],
            email=user_data["email"],
            hashed_password=hashed_password,
            role=user_data["role"]
        )
        db.add(user)
        print(f"Created user: {user_data['username']}")

db.commit()
print("✅ Demo users created!")