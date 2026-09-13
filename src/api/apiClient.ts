import { APIRequestContext, APIResponse } from '@playwright/test';
import { environmentConfig } from '../config/environments';

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async get(endpoint: string): Promise<APIResponse> {
    const url = `${environmentConfig.apiBaseURL}${endpoint}`;
    return this.request.get(url);
  }
}