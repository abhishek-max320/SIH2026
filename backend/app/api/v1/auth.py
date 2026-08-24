from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.core.security import verify_password, get_password_hash, create_access_token
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """Register a new user (Farmer, Expert, Officer)."""
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role or "farmer",
        phone=user_in.phone,
        farm_name=user_in.farm_name,
        primary_crop=user_in.primary_crop,
        state=user_in.state,
        district=user_in.district,
        latitude=user_in.latitude,
        longitude=user_in.longitude
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(subject=new_user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user)
    )

@router.post("/login", response_model=TokenResponse)
def login_user(login_data: UserLogin, db: Session = Depends(get_db)):
    """Authenticate with email and password to receive JWT bearer token."""
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is deactivated."
        )

    token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.get("/me", response_model=UserResponse)
def read_current_user_profile(current_user: User = Depends(get_current_user)):
    """Retrieve profile of currently authenticated user."""
    return UserResponse.model_validate(current_user)

@router.get("/demo-personas")
def get_demo_personas():
    """Retrieve pre-configured personas for 1-click judging verification."""
    return [
        {"role": "farmer", "name": "Rajesh Kumar", "email": "farmer@agrisentinel.ai", "password": "farmer123", "desc": "Farmer with 12 acres wheat in Punjab"},
        {"role": "expert", "name": "Dr. Ananya Sharma", "email": "expert@agrisentinel.ai", "password": "expert123", "desc": "Agronomist & plant pathologist"},
        {"role": "officer", "name": "Vikram Singh", "email": "officer@agrisentinel.ai", "password": "officer123", "desc": "State Surveillance Officer"},
        {"role": "admin", "name": "System Administrator", "email": "admin@agrisentinel.ai", "password": "admin123", "desc": "Platform health & AI registry manager"},
    ]
