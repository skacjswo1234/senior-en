export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const phone = formData.get('phone');
    const english_level = formData.get('english_level');
    const second_lang = formData.get('second_lang');
    const age = formData.get('age');
    const location = formData.get('location');

    if (!name || !phone) {
      return new Response(JSON.stringify({ success: false, message: '이름과 전화번호는 필수입니다.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // D1 데이터베이스에 저장
    const result = await env['senior-en-db'].prepare(
      `INSERT INTO inquiries (name, phone, english_level, second_lang, age, location) 
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(name, phone, english_level, second_lang, age, location).run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: '신청이 완료되었습니다.',
      id: result.meta.last_row_id 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: '오류가 발생했습니다. 다시 시도해주세요.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

