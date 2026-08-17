import { ProductModel, CategoryModel, CouponModel } from './models';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COUPONS } from '../data/initialData';

export async function seedDatabaseIfEmpty() {
  try {
    const productCount = await ProductModel.countDocuments();
    if (productCount === 0) {
      console.log('[MongoDB Seed] Seeding products into MongoDB...');
      await ProductModel.insertMany(INITIAL_PRODUCTS as any[]);
      console.log(`[MongoDB Seed] Inserted ${INITIAL_PRODUCTS.length} products successfully.`);
    }

    const categoryCount = await CategoryModel.countDocuments();
    if (categoryCount === 0) {
      console.log('[MongoDB Seed] Seeding categories into MongoDB...');
      await CategoryModel.insertMany(INITIAL_CATEGORIES as any[]);
      console.log(`[MongoDB Seed] Inserted ${INITIAL_CATEGORIES.length} categories successfully.`);
    }

    const couponCount = await CouponModel.countDocuments();
    if (couponCount === 0) {
      console.log('[MongoDB Seed] Seeding coupons into MongoDB...');
      await CouponModel.insertMany(INITIAL_COUPONS as any[]);
      console.log(`[MongoDB Seed] Inserted ${INITIAL_COUPONS.length} coupons successfully.`);
    }

    console.log('[MongoDB] Database ready and verified.');
  } catch (error) {
    console.error('[MongoDB Seed Error]:', error);
  }
}
