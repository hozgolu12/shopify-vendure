import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Workspace } from "./tenant-workspace.entity";

@Entity()
export class MeasurementField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fieldName: string;

  @Column("simple-json")
  selectedValues: string[];

  @ManyToOne(() => Workspace, (workspace) => workspace.measurementFields)
  workspace: Workspace;
}
