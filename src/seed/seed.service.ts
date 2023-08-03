import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
     private readonly productSerivce: ProductsService
  ){}

  //borramoos todos los campos e insertamos el seed
  async runSeed() {

    await this.productSerivce.deleteAllProducts()

    const products = initialData.products; 

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productSerivce.create(product))
    });

    return await Promise.all(insertPromises)   


   
  }

  
}


/*  
ASI POR SI SI SOLO FUNICONA PERO COMO DEVUELVE UNA PROMESA LO HACEMOS RESOLVIENDO LAS PROMESAS. CON PROMISE.ALL LE DECIMOS QUE 
ESPEERE A QUE SE RESUEVLA TODAS ESTAS PROMESAS Y CUANDO LO HAGA SIGUE CON LA SIGUINTE LINEA


    products.forEach(product => {
       this.productSerivce.create(product)
    }) 
    
    
    */