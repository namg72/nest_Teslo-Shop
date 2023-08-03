
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    [x: string]: any;

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,  // nombres unicos
    })
    title: string;

    @Column('float', {
          default: 0  // valor por defecto en caso de no insertar ninguno
    })
    price: number;


    @Column('text', {
        nullable: true, //Puede acdeptr nulos
    })
    description: string;


    @Column('text', {
       unique: true, //No puede heber dos slug iguales
    })
    slug: string;


    @Column('int', {
        default: 0  
     })
    stock: number;


    @Column('text', {
        array: true   // arreglo de string
    }) 
    sizes: string[]

    @Column('text') 
    gender: string

    @Column('text', {
        array: true,
        default: []
    }) 
    tags: string[]

    //Vamos a controlar que antes de insertar en la base de datos con el decorador @beforeInset() si no vie el slug que lo cree con el nombre del titulo
    //pasandolo a minuscular y quitando el apostrofe y los espacis vacions sustiuyendolos por _ y si viene que lo cambie a lo anterior

    @BeforeInsert()
    chekSlug(){

        if(!this.slug){

            this.slug = this.title
                            .toLowerCase()
                            .replaceAll("'", "")
                            .replaceAll(" ", "_")
        }else{
            this.slug = this.title
                            .toLowerCase()
                            .replaceAll("'", "")
                            .replaceAll(" ", "_")
        }

    }
     

    @BeforeUpdate()
    CheckSluckUpdate(){
        this.slug = this.slug
                    .toLowerCase()
                    .replaceAll("'", "")
                    .replaceAll(" ", "_")
                }

}


/* 
.- @PrimaryGeneratedColumn => Generamos el id automatico en este caso de teipo uuid


.- @Column => definimos el tip de columna y le podemos dar reglas,


.- @Column('numeric') => el tipo number no es soportado pir postgress hay que usar numeric


 .- Esta entidad la tenemos que importar en el producs.module mediante " ypoeOrmModule.forFeautre([Product])"
   Si se definuieran mas enteidad tambien se tendrian que agrera después del product 

*/