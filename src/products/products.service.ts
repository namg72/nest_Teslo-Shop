import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID  } from 'uuid';
import e from 'express';

@Injectable()
export class ProductsService {


  //Creamos una variable para visulaizar mejor los errores en consola
  private readonly logger =  new Logger('ProductsService')


  constructor(

    //Injectamos el prespository para poder insertar en la bd las entidadaes
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

  ){}

  //Insert producto in bd
  async create(createProductDto: CreateProductDto) {
    

   try {

    //Creamos la instancia del producto a insertar
      const product= this.productRepository.create(createProductDto);

      await this.productRepository.save(product);

      

      return product

   } catch (error) {
     
      this.handleDbExceptions(error)
      console.log(error.code);
    
   }

  }


  //Find all
  async findAll(paginatinDto: PaginationDto) {

   //estrameos los valores del paginatioDto que nos llega y si no llegada nada le damos un valor por defecto

   const {limit=10, offset=0} = paginatinDto
   try {

     const products:Product[] = await this.productRepository.find({
       //paginamos cone le limit y el skip 
       take:limit,
       skip:offset,
       
     })
                                            
              
      if(products.length===0){
        return "the bd is empty"
      }
        
        return products;
        
   } catch (error) {
     this.handleDbExceptions(error)
    
   }



  }
  
  //Finde one
  async findOne(term: string) {    


  let product:Product; 

  //comprobamos si es un uuid listamos por el
  if(isUUID(term)){

    product = await this.productRepository.findOneBy({id: term})

  } else{

    //mediante el queryBuiler hacemos una query SQL para buscar por slug o
    const queryBuilder = this.productRepository.createQueryBuilder();

    product = await queryBuilder
       .where('LOWER(title) = :title or slug = :slug', {
          title: term.toLowerCase(),
          slug: term.toLowerCase(),
       }).getOne();


  }
 

    if(!product){
      throw new NotFoundException(`the producto  "${term} is not found in bd"`)
    }

    return product

  }


  // update
  async update(id: string, updateProductDto: UpdateProductDto) {

   //vamos a utilizar el metodo preload de Repository para bvuscar un producto por su id, expandir sus datos y del dto y sustirulilos
   //por los que le enviamos

   const product = await this.productRepository.preload({
    id:id,
    ... updateProductDto
   });

   //Si no se encuaentra poducto se lanza error y si tenmemos el producto lo guardamos en la bd

   if(!product){
     throw new BadRequestException(`the producto wint id "${id} no fount`)
   }
  try {
    
    await this.productRepository.save(product);
    return product;

  } catch (error) {
      this.handleDbExceptions(error)
  }


     
  }


  //delete
  async remove(id: string) {

    const product:Product = await this.findOne(id)

    await this.productRepository.remove(product)

    return `the product with id "${id} has been remove from the bd`;
  }



//metodo para manjera los errores 
 private handleDbExceptions(error: any){
    if(error.code ==='23505') {

      
     
      throw new BadRequestException(error.detail)
    }

    this.logger.error(error);  //sacamos por consola mas claramente el error
 
    throw new InternalServerErrorException('Unexpect error, check server logs ')

 }




}
