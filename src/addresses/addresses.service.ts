import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Address, AddressDocument } from './schemas/address.schema';
import { Model } from 'mongoose';

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Address.name)
    private addressModel: Model<AddressDocument>,
  ) {}

  async create(data: any) {
    return this.addressModel.create(data);
  }

  async findByUser(userId: string) {
    return this.addressModel.find({ userId });
  }

  async update(id: string, data: any) {
    const address = await this.addressModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!address) throw new NotFoundException('Address not found');

    return address;
  }

  async delete(id: string) {
    const address = await this.addressModel.findByIdAndDelete(id);

    if (!address) throw new NotFoundException('Address not found');

    return { message: 'Address deleted successfully' };
  }
}
