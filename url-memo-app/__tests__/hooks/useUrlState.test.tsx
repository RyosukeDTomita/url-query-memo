import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useUrlState } from '@/hooks/useUrlState';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();

describe('useUrlState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
  });

  it('should initialize with default value when no URL parameter exists', () => {
    const { useSearchParams } = require('next/navigation');
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });

    const { result } = renderHook(() => useUrlState('test', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should initialize with URL parameter value when it exists', () => {
    const { useSearchParams } = require('next/navigation');
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('urlValue'),
    });

    const { result } = renderHook(() => useUrlState('test', 'default'));
    expect(result.current[0]).toBe('urlValue');
  });

  it('should update URL when state changes', () => {
    const { useSearchParams } = require('next/navigation');
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
      toString: jest.fn().mockReturnValue(''),
    });

    const { result } = renderHook(() => useUrlState('test', 'default'));

    act(() => {
      result.current[1]('newValue');
    });

    expect(mockReplace).toHaveBeenCalledWith('?test=newValue');
  });

  it('should use custom encode function', () => {
    const { useSearchParams } = require('next/navigation');
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
      toString: jest.fn().mockReturnValue(''),
    });

    const customEncode = (value: string) => Buffer.from(value).toString('base64');
    const { result } = renderHook(() => 
      useUrlState('test', 'default', { encode: customEncode })
    );

    act(() => {
      result.current[1]('newValue');
    });

    const expectedEncoded = customEncode('newValue');
    expect(mockReplace).toHaveBeenCalledWith(`?test=${encodeURIComponent(expectedEncoded)}`);
  });

  it('should use custom decode function', () => {
    const { useSearchParams } = require('next/navigation');
    const encodedValue = Buffer.from('decodedValue').toString('base64');
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(encodedValue),
    });

    const customDecode = (value: string) => Buffer.from(value, 'base64').toString();
    const { result } = renderHook(() => 
      useUrlState('test', 'default', { decode: customDecode })
    );

    expect(result.current[0]).toBe('decodedValue');
  });

  it('should handle multiple parameters in URL', () => {
    const { useSearchParams } = require('next/navigation');
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('value1'),
      toString: jest.fn().mockReturnValue('param1=value1&param2=value2'),
    });

    const { result } = renderHook(() => useUrlState('param1', 'default'));

    act(() => {
      result.current[1]('newValue');
    });

    expect(mockReplace).toHaveBeenCalledWith('?param1=newValue&param2=value2');
  });

  it('should remove parameter when value is empty', () => {
    const { useSearchParams } = require('next/navigation');
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('value'),
      toString: jest.fn().mockReturnValue('test=value'),
    });

    const { result } = renderHook(() => useUrlState('test', ''));

    act(() => {
      result.current[1]('');
    });

    expect(mockReplace).toHaveBeenCalledWith('?');
  });
});