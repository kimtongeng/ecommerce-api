import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async create(userData: Partial<User>) {
    return this.userModel.create(userData);
  }
  async findById(id: string) {
    return this.userModel.findById(id).select('-password');
  }
  async updateRefreshToken(userId: string, refreshToken: string | null) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { refreshToken },
      { new: true },
    );
  }
  async update(userId: string, data: any) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true },
    );
  }
}
