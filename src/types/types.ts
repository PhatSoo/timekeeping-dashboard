export interface IEmployee {
  _id: string;
  name: string;
  email: string;
  CCCD: string;
  isPartTime: boolean;
  sex: boolean;
  avatar: string;
  roleId: {
    typeName: string;
  };
}

export interface IShift {
  _id: string;
  shiftName: string;
  startTime: string;
  endTime: string;
}
