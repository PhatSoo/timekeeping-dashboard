export interface IEmployee {
  _id: string;
  name: string;
  email: string;
  CCCD: string;
  isPartTime: boolean;
  sex: boolean;
  avatar: string;
  role: {
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

export interface IAttendance {
  _id: string;
  employee: {
    _id: string;
    name: string;
    avatar: string;
  };
  workDate: Date;
  workShift: {
    _id: string;
    shiftName: string;
    startTime: string;
    endTime: string;
  } | null;
  checkIn: {
    time: Date;
    image: string;
    score: Number;
  };
  checkOut: {
    time: Date;
    image: string;
    score: Number;
  };
  status: 'NULL' | 'ON LEAVE' | 'WORKING' | 'DONE';
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
  status: string;
}

export interface IStatistic {
  attendances: IAttendance[];
  employee: IEmployee;
}

export interface ISettings {
  workDate: string[];
  workHours: {
    startTime: string;
    endTime: string;
  };
}
