from uuid import UUID
from fastapi import APIRouter, HTTPException
from data_base import getAllProducts, add_product, getProductByID, get_measurement_names, add_required_measurements
from pydantic import BaseModel, Field
from typing import List, Optional


router = APIRouter(prefix="/api/product")


class ProductCreate(BaseModel):
    name: str = Field(..., max_length=100)
    description: str = ""
    price: float = Field(..., gt=0)
    category: str = Field(..., max_length=50)
    imglink: str = ""
    composition: str = ""
    gender: str = Field(..., pattern="^(male|female|unisex)$")
    required_measurements: List[str] = []



@router.post("/")
async def create_product(product: ProductCreate):
    try:
        new_product = add_product(
            name=product.name,
            description=product.description,
            price=product.price,
            gender=product.gender,
            category=product.category,
            imglink=product.imglink,
            composition=product.composition
        )
        add_required_measurements(new_product.productid, product.required_measurements)

        return {"message": "Product successfully created", "product": new_product}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding product: {str(e)}")


@router.get("/")
async def catalog_all():
    return getAllProducts()

@router.get("/measurements")
async def get_measurements():
    return get_measurement_names()


@router.get("/{product_id}")
async def asteroid_by_id(product_id: int):
    product_info = getProductByID(product_id)
    combined_info = {**product_info}
    return combined_info
