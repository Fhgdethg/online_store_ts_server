export interface IUserMinimal {
  email: string;
  password: string;
}

export interface IUserWithId extends IUserMinimal {
  id: any;
}

export interface IFullUser extends IUserWithId {
  diskSpace: number;
  usedSpace: number;
  photo: string;
  files: any[];
}
