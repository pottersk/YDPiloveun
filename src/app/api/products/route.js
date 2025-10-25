import { NextResponse } from 'next/server';

/**
 * ดึงรายการสินค้าทั้งหมดจาก Fake Store API
 * @param {Request} request - Request object ที่เข้ามา
 * @returns {NextResponse} JSON response ที่มีรายการสินค้าทั้งหมดหรือข้อความ error
 */
export async function GET(request) {
  try {
    const apiResponse = await fetch('https://fakestoreapi.com/products', { //ดึงข้อมูลสินค้าทั้งหมด
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