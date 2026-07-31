import { headers } from "next/headers";
import { fetchProducts } from "../../../../lib/data-layer";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;

    //extrair parametros
    const limit = parseInt(searchParams.get("limit") || 6);
    const featured = searchParams.get("featured") === "true";

    const products = await fetchProducts({ limit, featuredOnly: featured });

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Erro na API de produtos:", error);
    return NextResponse.json(
      { error: "Error interno do servidor" },
      { status: 500 },
    );
  }
}
