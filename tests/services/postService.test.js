// tests/postService.test.js
const axios = require('axios');
const { getPostById } = require('../src/services/postService');

// Mock toàn bộ thư viện axios
jest.mock('axios');

describe('getPostById', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('nên trả về dữ liệu bài viết nếu API gọi thành công', async () => {
    // 1. Chuẩn bị dữ liệu giả lập cho phản hồi từ axios
    const mockPost = { id: 1, title: 'Mock Post', body: 'This is a mock post.' };
    const mockResponse = { data: mockPost };

    // 2. Mock hàm axios.get để nó trả về Promise thành công với dữ liệu trên
    axios.get.mockResolvedValue(mockResponse);

    // 3. Gọi hàm cần kiểm thử
    const postId = 1;
    const result = await getPostById(postId);

    // 4. Xác minh kết quả
    expect(result).toEqual(mockPost);
    expect(axios.get).toHaveBeenCalledWith(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  test('nên trả về null nếu API trả về lỗi 404', async () => {
    // 1. Chuẩn bị một đối tượng lỗi giả lập
    const mockError = {
      response: {
        status: 404,
      },
    };

    // 2. Mock hàm axios.get để nó trả về một Promise bị lỗi
    axios.get.mockRejectedValue(mockError);

    // 3. Gọi hàm cần kiểm thử
    const postId = 9999;
    const result = await getPostById(postId);

    // 4. Xác minh kết quả
    expect(result).toBeNull();
    expect(axios.get).toHaveBeenCalledWith(`https://jsonplaceholder.typicode.com/posts/${postId}`);
  });

  test('nên ném ra một lỗi nếu API trả về một lỗi khác 404', async () => {
    // 1. Chuẩn bị một lỗi giả lập bất kỳ (ví dụ: lỗi mạng)
    const mockError = new Error('Network error');

    // 2. Mock hàm axios.get để nó trả về một Promise bị lỗi
    axios.get.mockRejectedValue(mockError);

    // 3. Xác minh rằng hàm sẽ ném ra lỗi khi được gọi
    const postId = 101;
    await expect(getPostById(postId)).rejects.toThrow('Không thể lấy bài viết');
    expect(axios.get).toHaveBeenCalledWith(`https://jsonplaceholder.typicode.com/posts/${postId}`);
  });
});