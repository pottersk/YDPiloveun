import { NextResponse } from 'next/server';

/**
 * ดึงรายการสินค้าทั้งหมดหรือตามหมวดหมู่จาก Fake Store API
 * @param {Request} request - Request object ที่เข้ามา
 * @returns {NextResponse} JSON response ที่มีรายการสินค้าทั้งหมดหรือข้อความ error
 */
export async function GET(request) {
  try {
    // ดึง category จาก query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // สร้าง URL ตาม category ที่ได้รับ
    let url = 'https://fakestoreapi.com/products';
    if (category) {
      url = `https://fakestoreapi.com/products/category/${category}`;
    }
    
    const apiResponse = await fetch(url, { //ดึงข้อมูลสินค้าทั้งหมด
      headers: {
        'Content-Type': 'application/json', 
      },
    });

    if (!apiResponse.ok) {
      throw new Error('Failed to fetch products'); //ถ้าดึงข้อมูลไม่เจอส่ง error
    }

    const productsData = await apiResponse.json(); //แปลงข้อมูลเป็น json

    return NextResponse.json({ products: productsData });
  } catch (error) {
    console.error('Error in GET /api/products:', error); //log error
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}