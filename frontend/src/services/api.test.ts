// Unit tests for API service
import { fetchWithErrorHandling } from './api';

// Mock fetch globally
global.fetch = jest.fn();

describe('fetchWithErrorHandling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return JSON data when the response is successful', async () => {
    const mockResponse = { data: 'test' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchWithErrorHandling('/test', {});
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith('/test', {});
  });

  it('should throw an error when the response is not ok', async () => {
    const mockError = { message: 'Error occurred' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    });

    await expect(fetchWithErrorHandling('/test', {})).rejects.toThrow('Error occurred');
    expect(fetch).toHaveBeenCalledWith('/test', {});
  });

  it('should throw an error when fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchWithErrorHandling('/test', {})).rejects.toThrow('Network error');
    expect(fetch).toHaveBeenCalledWith('/test', {});
  });
});