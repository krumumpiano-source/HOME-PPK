// Integration tests for API service
import { fetchWithErrorHandling } from './api';

global.fetch = jest.fn();

describe('Integration tests for API service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle a successful API call', async () => {
    const mockResponse = { data: 'integration test success' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchWithErrorHandling('/integration-test', {});
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith('/integration-test', {});
  });

  it('should handle an API error response', async () => {
    const mockError = { message: 'Integration test error' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    });

    await expect(fetchWithErrorHandling('/integration-test', {})).rejects.toThrow('Integration test error');
    expect(fetch).toHaveBeenCalledWith('/integration-test', {});
  });

  it('should handle a network failure', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));

    await expect(fetchWithErrorHandling('/integration-test', {})).rejects.toThrow('Network failure');
    expect(fetch).toHaveBeenCalledWith('/integration-test', {});
  });
});