
import { Product } from "./product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'product-Image'})
export class ProductImage{

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    @ManyToOne(
        () => Product,
        (product) => product.images,
        {onDelete: 'CASCADE'}

    )
    product: Product

}   