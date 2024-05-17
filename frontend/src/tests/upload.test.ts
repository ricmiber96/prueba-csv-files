import { describe, it, expect,vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import {uploadFile} from '../services/upload.ts';
import { T } from 'vitest/dist/reporters-yx5ZTtEV.js';


describe('Upload Function', () => {

  // Reset mocks after each test
  afterEach(() => {
    vi.resetAllMocks();
  })

  it('should upload the file successfully', async () => {
    const mockFile = new File(['content'], 'test.CSV', { type: 'text/csv' });
    mockFile.text
    const mockApiResponse = { data: 'Some uploaded data' };

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
    });

    const [error, data] = await uploadFile(mockFile)
    console.log('Error:', error)
    console.log('Data:', data)

    expect(error).toBeUndefined()
    expect(data).toEqual(mockApiResponse.data)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/files'), expect.any(Object))
  })

  it('should return an error when the file upload fails', async () => {
    const mockFile = new File(['content'], 'test.csv', { type: 'text/csv' });
    const mockError = new Error('Failed to upload file: Internal Server Error');
   

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error'
    });

    const [error, data] = await uploadFile(mockFile)
    console.log('Error:', error)
    console.log('Data:', data)

    expect(data).toBeUndefined()
    expect(error).toBeInstanceOf(Error)
    expect(data).toBeUndefined()
    expect(error?.message).toBe(mockError.message)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/files'), expect.any(Object))
  })

  it('should reject files that are not of type text/csv', async () => {
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    const mockApiResponse = { data: 'Some uploaded data' };
    const mockError = new Error('Invalid file type: text/plain');

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
    });

    const [error, data] = await uploadFile(mockFile)
    console.log('Error:', error)
    console.log('Data:', data)


    expect(data).toBeUndefined()
    expect(error).toBeInstanceOf(Error)
    expect(data).toBeUndefined()
    expect(error?.message).toBe(mockError.message)
    expect(fetch).not.toHaveBeenCalled()
  })

})

  // Reset mocks after each test
  afterAll(() => {
    vi.resetAllMocks()
  })