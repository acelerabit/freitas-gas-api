import { randomUUID } from 'node:crypto';
import { Replace } from './../../helpers/Replace';

type Role = 'ADMIN' | 'USER';

export interface UserProps {
  name: string;
  email: string;
  password?: string;
  role: Role;
  createdAt: Date;
}

export class User {
  private _id: string;
  private props: UserProps;

  constructor(props: Replace<UserProps, { createdAt?: Date }>, id?: string) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
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

  public get password(): string {
    return this.props.password;
  }

  public set password(password: string) {
    this.props.password = password;
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
