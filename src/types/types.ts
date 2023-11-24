export interface IEmployee {
  _id: string;
  name: string;
  email: string;
  CCCD: string;
  isPartTime: boolean;
  sex: boolean;
  avatar: string;
  roleId: {
    _id: string;
    typeName: string;
  };
}

export interface IRole {
  _id: string;
  typeName: string;
}

export interface IShift {
  _id: string;
  shiftName: string;
  startTime: string;
  endTime: string;
}

export interface IFulltime {
  _id: string;
  employeeId: string;
  checkInTime: Date;
  checkOutTime: Date;
  workDate: Date;
  status: boolean;
}

export interface ISchedule {
  _id: string;
  employee: {
    _id: string;
  };
  workDate: Date;
  workShift: [
    {
      _id: string;
      shiftName: string;
    }
  ];
}

export interface IPartTime {
  _id: string;
  employee: string;
  workDate: Date;
  workShift: {
    _id: string;
    shiftName: string;
  };
  checkInTime: Date;
  checkOutTime: Date;
  status: ['NULL', 'WORKING', 'DONE'];
}

export interface IFormRequest {
  _id: string;
  employee: {
    _id: string;
    name: string;
    email: string;
  };
  startDate: Date;
  endDate: Date;
  workShift: {
    _id: string;
    shiftName: string;
  };
  reason: string;
  status: number;
}
