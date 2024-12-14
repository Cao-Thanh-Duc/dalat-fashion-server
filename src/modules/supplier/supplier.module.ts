import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';

@Module({
  controllers: [SupplierController],
  providers: [SupplierService, PrismaService, JwtService],
})
export class SupplierModule {}
