import { ProductModel, CategoryModel, CouponModel } from './models';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COUPONS } from '../data/initialData';

export async function seedDatabaseIfEmpty() {
  try {
    const validProductIds = INITIAL_PRODUCTS.map(p => p.id);
    
    // Clean up any old dummy products not in the official catalog
    await ProductModel.deleteMany({ id: { $nin: validProductIds } });

    console.log(`[MongoDB Seed] Syncing ${INITIAL_PRODUCTS.length} official products into MongoDB Atlas...`);
    for (const prod of INITIAL_PRODUCTS) {
      await ProductModel.findOneAndUpdate({ id: prod.id }, prod as any, { upsert: true, new: true });
    }
    console.log(`[MongoDB Seed] Upserted all ${INITIAL_PRODUCTS.length} verified products successfully.`);

    const validCategoryIds = INITIAL_CATEGORIES.map(c => c.id);
    await CategoryModel.deleteMany({ id: { $nin: validCategoryIds } });
    for (const cat of INITIAL_CATEGORIES) {
      await CategoryModel.findOneAndUpdate({ id: cat.id }, cat as any, { upsert: true, new: true });
    }

    for (const coup of INITIAL_COUPONS) {
      await CouponModel.findOneAndUpdate({ code: coup.code }, coup as any, { upsert: true, new: true });
    }

    console.log('[MongoDB] Database synchronized and clean with PlayBeat verified catalog.');
  } catch (error) {
    console.error('[MongoDB Seed Error]:', error);
  }
}
