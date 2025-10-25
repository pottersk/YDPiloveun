import { NextResponse } from 'next/server';

/**
 * ดึงข้อมูลสินค้าตัวเดียวจาก Fake Store API โดยใช้ ID
 * @param {Request} request - Request object ที่เข้ามา
 * @param {object} context - Context object ที่มี route parameters
 * @param {string} context.params.id - ID ของสินค้าที่ต้องการดึงข้อมูล
 * @returns {NextResponse} json response ที่มีข้อมูลสินค้าหรือข้อความ error
 */
export async function GET(request, { params }) {
  // Await params ตาม Next.js 15 requirement
  const resolvedParams = await params;
  
  // ตรวจสอบ product ID ก่อนใช้
  if (!resolvedParams.id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 }); //ถ้าไม่มี ID จะส่ง error
  }

  try {
    const { id } = resolvedParams;
    const apiResponse = await fetch(`https://fakestoreapi.com/products/${id}`);

    if (!apiResponse.ok) {
      throw new Error('Failed to fetch product'); //ถ้าดึงข้อมูลไม่เจอส่ error
    }

    const productData = await apiResponse.json(); //ดึงข้อมูลสินค้า

    return NextResponse.json(productData); //ส่งสินค้าในรูป json
  } catch (error) { 
    console.error(`Error in GET /api/products/[id] for ID: ${resolvedParams.id}`, error); //log error
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
