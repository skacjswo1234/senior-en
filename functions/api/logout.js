export async function onRequestPost(context) {
  return new Response(JSON.stringify({ success: true, message: '로그아웃되었습니다.' }), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Set-Cookie': 'admin_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
    }
  });
}

