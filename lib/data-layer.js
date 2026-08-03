import { supabase } from "../lib/supabase";

export const fetchCategories = async () => {
  try {
    const { data: rawCategories, error } = await supabase
      .from("categories")
      .select('id, name, "imageSrc"')
      .order("name");

    if (error) {
      console.error("Erro ao buscar categorias do supabase", error);
      throw new Error("Erro ao buscar categorias" + error.message);
    }
    return rawCategories;
  } catch (error) {
    console.error("Erro no fetchCategories", error);
    throw error;
  }
};

export const fetchProducts = async (options = {}) => {
  try {
    const { limit = 6, featureOnly = false } = options;

    let query = supabase
      .from("products")
      .select(
        `
        id, 
        name, 
        description, 
        price, 
        "imageSrc", 
        colors, 
        sizes, 
        "categoryId", 
        category:categories(id, name, "imageSrc"), 
        isFeatured
        `,
      )
      .eq('"isActive"', true)
      .order('"isFeatured"', { ascending: false })
      .order('"createdAt"', { ascending: false });

    //filtro por featured se solicitado

    if (featureOnly) {
      query = query.eq('"isFeatured"', true);
    }

    //aplicar o limite
    query = query.limit(limit);

    const { data: rawProducts, error } = await query;

    if (error) {
      console.error("Erro ao buscar produtos do supabase", error);
      throw new Error("Erro ao buscar produtos" + error.message);
    }

    return rawProducts;
  } catch (error) {
    console.error("Erro no fetchProducts", error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const { data: product, error } = await supabase
      .from("products")
      .select(
        `
                id,
                name,
                description,
                price,
                imageSrc,
                colors,
                sizes,
                categoryId,
                category:categories(id, name, imageSrc),
                "isFeatured"
            `,
      )
      .eq("id", id)
      .eq("isActive", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Erro ao buscar produto por ID:", error);
      throw new Error(`Erro ao buscar produto: ${error.message}`);
    }
    return product;
  } catch (error) {
    console.error("Erro no fetchProductById:", error);
    throw error;
  }
};

export const fetchProductsBySearch = async (searchTerm, options = {}) => {
  try {
    const { limit = 20 } = options;

    if (searchTerm?.trim().length < 2) {
      return [];
    }

    const query = searchTerm.trim().toLowerCase();

    const { data: products, error } = await supabase
      .from("products")
      .select(
        `
          id,
          name,
          description,
          price,
          imageSrc,
          colors,
          sizes,
          categoryId,
          isFeatured
        `,
      )
      .eq("isActive", true)
      .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
      .order("isFeatured", { ascending: false })
      .order("name", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Erro ao buscar produtos por busca:", error);
      throw new Error(`Erro ao buscar produtos: ${error.message}`);
    }

    return products || [];
  } catch (error) {
    console.error("Erro no fetchProductsBySearch:", error);
    throw error;
  }
};
