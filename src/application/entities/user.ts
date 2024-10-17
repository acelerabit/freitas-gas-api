import { randomUUID } from 'node:crypto';
import { Replace } from './../../helpers/Replace';

type Role = 'ADMIN' | 'DELIVERYMAN';

export interface UserProps {
  name: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  status?: boolean;
  acceptNotifications?: boolean;
  role: Role;
  createdAt: Date;
  accountAmount?: number;
}

export class User {
  private _id: string;
  private props: UserProps;

  constructor(props: Replace<UserProps, { createdAt?: Date }>, id?: string) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      status: props.status ?? false,
      createdAt: props.createdAt ?? new Date(),
      accountAmount: props.accountAmount ?? 0,
    };
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this.props.name;
  }

  public set name(name: string) {
    this.props.name = name;
  }

  public get email(): string {
    return this.props.email;
  }

  public set email(email: string) {
    this.props.email = email;
  }

  public get accountAmount(): number {
    return this.props.accountAmount;
  }

  public set accountAmount(accountAmount: number) {
    this.props.accountAmount = accountAmount;
  }

  public get password(): string {
    return this.props.password;
  }

  public set password(password: string) {
    this.props.password = password;
  }

  public get avatarUrl(): string {
    return this.props.avatarUrl;
  }

  public set avatarUrl(avatarUrl: string) {
    this.props.avatarUrl = avatarUrl;
  }

  public get acceptNotifications(): boolean {
    return this.props.acceptNotifications;
  }

  public set acceptNotifications(acceptNotifications: boolean) {
    this.props.acceptNotifications = acceptNotifications;
  }

  public get status(): boolean {
    return this.props.status;
  }

  public set status(status: boolean) {
    this.props.status = status;
  }

  public get role(): Role {
    return this.props.role;
  }

  public set role(role: Role) {
    this.props.role = role;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(props: Replace<UserProps, { createdAt?: Date }>, id?: string) {
    const user = new User(props, id);

    return user;
  }
}
