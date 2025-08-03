// tests/postRoutes.test.js
const request = require('supertest');
const express = require('express');
const postRouter = require('../src/routes/postRoutes');
const postService = require('../src/services/postService');

// Tạo một instance app Express để kiểm thử
const app = express();
app.use(express.json());
app.use(postRouter);

// Jest.mock() sẽ tự động "mock" toàn bộ module, thay thế các hàm
// bằng các hàm giả lập (mock functions).
jest.mock('../src/services/postService');

describe('GET /posts/:postId', () => {

  // Đảm bảo rằng các mock được reset sau mỗi test
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('nên trả về thông tin bài viết nếu API trả về thành công', async () => {
    // Dữ liệu giả lập (mock data)
    const mockPost = {
      id: 1,
      title: 'Tieu de bai viet',
      body: 'Noi dung bai viet',
    };

    // Sử dụng jest.fn().mockResolvedValue() để giả lập hàm bất đồng bộ
    // Khi postService.getPostById được gọi, nó sẽ trả về một Promise được resolve
    // với mockPost.
    postService.getPostById.mockResolvedValue(mockPost);

    const response = await request(app).get('/posts/1');

    // Kiểm tra kết quả
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockPost);

    // Kiểm tra xem hàm mock đã được gọi với tham số chính xác chưa
    expect(postService.getPostById).toHaveBeenCalledWith('1');
    expect(postService.getPostById).toHaveBeenCalledTimes(1);
  });

  test('nên trả về 404 nếu không tìm thấy bài viết (API trả về null)', async () => {
    // Giả lập hàm getPostById trả về null để mô phỏng API trả về 404
    postService.getPostById.mockResolvedValue(null);

    const response = await request(app).get('/posts/9999');

    // Kiểm tra kết quả
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: 'Không tìm thấy bài viết' });

    // Kiểm tra xem hàm mock đã được gọi với tham số chính xác chưa
    expect(postService.getPostById).toHaveBeenCalledWith('9999');
  });

  test('nên trả về 500 nếu service bị lỗi', async () => {
    // Giả lập hàm getPostById bị lỗi bằng cách sử dụng .mockRejectedValue()
    // Nó sẽ trả về một Promise bị reject
    postService.getPostById.mockRejectedValue(new Error('API failed'));

    const response = await request(app).get('/posts/101');

    // Kiểm tra kết quả
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: 'Lỗi máy chủ nội bộ' });

    // Kiểm tra xem hàm mock đã được gọi với tham số chính xác chưa
    expect(postService.getPostById).toHaveBeenCalledWith('101');
  });
});