import { ProductModel, CategoryModel, CouponModel } from './models';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COUPONS } from '../data/initialData';

export async function seedDatabaseIfEmpty() {
  try {
    const productCount = await ProductModel.countDocuments();
    if (productCount < INITIAL_PRODUCTS.length) {
      console.log(`[MongoDB Seed] Syncing ${INITIAL_PRODUCTS.length} products into MongoDB...`);
      for (const prod of INITIAL_PRODUCTS) {
        await ProductModel.findOneAndUpdate({ id: prod.id }, prod as any, { upsert: true, new: true });
      }
      console.log(`[MongoDB Seed] Upserted all ${INITIAL_PRODUCTS.length} products successfully.`);
    }

    const categoryCount = await CategoryModel.countDocuments();
    if (categoryCount < INITIAL_CATEGORIES.length) {
      console.log(`[MongoDB Seed] Syncing ${INITIAL_CATEGORIES.length} categories into MongoDB...`);
      for (const cat of INITIAL_CATEGORIES) {
        await CategoryModel.findOneAndUpdate({ id: cat.id }, cat as any, { upsert: true, new: true });
      }
      console.log(`[MongoDB Seed] Upserted all ${INITIAL_CATEGORIES.length} categories successfully.`);
    }

    const couponCount = await CouponModel.countDocuments();
    if (couponCount < INITIAL_COUPONS.length) {
      console.log(`[MongoDB Seed] Syncing ${INITIAL_COUPONS.length} coupons into MongoDB...`);
      for (const coup of INITIAL_COUPONS) {
        await CouponModel.findOneAndUpdate({ code: coup.code }, coup as any, { upsert: true, new: true });
      }
      console.log(`[MongoDB Seed] Upserted all ${INITIAL_COUPONS.length} coupons successfully.`);
    }

    console.log('[MongoDB] Database synchronized and verified with PlayBeat catalog.');
  } catch (error) {
    console.error('[MongoDB Seed Error]:', error);
  }
}
