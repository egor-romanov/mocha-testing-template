import { step } from 'ts-test-decorators';
import { SocketClient } from '../helpers/SocketClient';
import { AllureCommons } from '../utils/AllureCommon';

export class AdminAuth {
  private _client: SocketClient;

  constructor(client: SocketClient) {
    this._client = client;
  }

  @step('SignIn to admin panel by login and password')
  async signIn(username: string, password: string): Promise<SignInResponse> {
    const response = await this._client.send({
      id: '1',
      method: 'auth.signIn',
      data: {
        username: username,
        password: password,
      },
    });

    AllureCommons.attachText('signIn raw result', JSON.stringify(response));

    return response as unknown as SignInResponse;
  }

  @step('SignIn to admin panel by session')
  async signInBySession(session: string): Promise<SignInResponse> {
    const response = await this._client.send({
      id: '1',
      method: 'auth.signInBySession',
      data: {
        session: session,
      },
    });

    AllureCommons.attachText('signInBySession raw result', JSON.stringify(response));

    return response as unknown as SignInResponse;
  }

  @step('SignOut from admin panel')
  async signOut(): Promise<SignOutResponse> {
    const response = await this._client.send({
      id: '1',
      method: 'auth.signOut',
      data: {},
    });

    AllureCommons.attachText('signOut raw result', JSON.stringify(response));

    return response as unknown as SignOutResponse;
  }
}

export interface SignOutResponse {
  status: string;
}

export interface SignInResponse {
  username: string;
  roles: Roles;
  session: string;
  sessionExpiration: Date;
}

export interface Roles {
  isRoot: boolean;
  users: Map<string, BasicRole>;
  actionTemplates: Map<string, BasicRole>;
  actions: Map<string, BasicRole>;
  outlets: Map<string, OutletRole>;
  partners: Map<string, BasicRole>;
}

export interface BasicRole {
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface OutletRole extends BasicRole {
  list: boolean;
  createAction: boolean;
  cashier: boolean;
}
