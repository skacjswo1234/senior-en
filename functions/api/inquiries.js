export async function onRequestGet(context) {
  const { request, env } = context;
  
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (id) {
      // 특정 문의 내역 조회
      const inquiry = await env['senior-en-db'].prepare(
        'SELECT * FROM inquiries WHERE id = ?'
      ).bind(id).first();

      if (!inquiry) {
        return new Response(JSON.stringify({ success: false, message: '문의 내역을 찾을 수 없습니다.' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true, data: inquiry }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // 전체 문의 내역 조회
      const inquiries = await env['senior-en-db'].prepare(
        'SELECT * FROM inquiries ORDER BY created_at DESC'
      ).all();

      return new Response(JSON.stringify({ success: true, data: inquiries.results }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: '문의 내역을 불러오는 중 오류가 발생했습니다.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

