import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID  } from 'uuid';
import { ProductImage } from './entities/products-image.entity';

@Injectable()
export class ProductsService {


  //Creamos una variable para visulaizar mejor los errores en consola
  private readonly logger =  new Logger('ProductsService')


  constructor(

    //Injectamos el prespository para poder insertar en la bd las entidadaes
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    //injectamos el repositorio de las imagens
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

  ){}

  //Insert producto in bd
  async create(createProductDto: CreateProductDto) {
    

   try {

    const {images =[] , ...productDetails  } = createProductDto

    //Creamos la instancia del producto a insertar
      const product= this.productRepository.create({
        ...productDetails,
        images: images.map( image => this.productImageRepository.create({url:image}))
      
      });

      await this.productRepository.save(product);

      

      return {...product, images:images  } 

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
       //paginamos cone le limit y el skip y el relation para ver la columna de la imagen realacionada
       take:limit,
       skip:offset,
       relations :{
        images: true
       } 
       
     })
                                            
              
      if(products.length===0){
        return "the bd is empty"
      }
        
        return products;  // ** para ver solo los url de las iamgnes ver abajo

        
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
    const queryBuilder = this.productRepository.createQueryBuilder('prod');

    product = await queryBuilder
       .where('LOWER(title) = :title or slug = :slug', {
          title: term.toLowerCase(),
          slug: term.toLowerCase(),
          
       })
       .leftJoinAndSelect('prod.images', 'prodImages')
       .getOne();


  }
 

    if(!product){
      throw new NotFoundException(`the producto  "${term} is not found in bd"`)
    }

    return product

  }



   //Metodo para mostrar las imagens planas, este metodo lo que es llamar al  metodo findOne y desectrutuvra las imagenes para mostrar solo el url y luego indicarle
   // al congtrolador que use este en lugar del findOnde

    async findOnePlain(term: string){

      const product= await this.findOne(term);

      return {
            ...product,
            images: product.images.map( image => image.url)
         }
      }

    



  // update
  async update(id: string, updateProductDto: UpdateProductDto) {

   //vamos a utilizar el metodo preload de Repository para bvuscar un producto por su id, expandir sus datos y del dto y sustirulilos
   //por los que le enviamos

   const product = await this.productRepository.preload({
    id:id,
    ... updateProductDto,
    images:[]
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


//Metodo para borrar todas los productos
async deleteAllProducts(){

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    try {
      
      return await queryBuilder
          .delete()
          .where({})   //condicion para que los coja todos
          .execute()


    } catch (error) {
       this.handleDbExceptions(error)
    }

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


/*

** APLANAR LAS IMANGES Y SACAR LOS LO URL EN EL METODO FINDALL

    con el .map desectruturamos el array y y lo modificcamos con el primer .map
    y con el segundo ho hacemso con el array de las imagenes para solo reornar
    la url y no el id


    return products.map( product => ({
        ...product,
        images: product.images.map( img => img)
    }))



*/