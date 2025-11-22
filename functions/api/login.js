export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const { password } = await request.json();

    if (!password) {
      return new Response(JSON.stringify({ success: false, message: '비밀번호를 입력해주세요.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 관리자 계정 확인 (비밀번호만 비교)
    const admin = await env['senior-en-db'].prepare(
      'SELECT * FROM admin LIMIT 1'
    ).first();

    if (!admin || admin.password !== password) {
      return new Response(JSON.stringify({ success: false, message: '비밀번호가 올바르지 않습니다.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: '로그인 성공'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: '로그인 중 오류가 발생했습니다.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

