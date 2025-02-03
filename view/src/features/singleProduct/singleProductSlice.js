import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loadProductData = createAsyncThunk(
    'singleProduct/loadProductData',
    async(id) => {
        try{            
            const endpoint = `/api/products/${id}`;
            const response = await fetch(endpoint);
            if(response.ok) {
                const jsonResponse = await response.json();
                return jsonResponse;
            }
        } catch(e) {
            console.error('Error getting products data.');
        }
    }
)

const singleProductSlice = createSlice({
    name: 'singleProduct',
    initialState: {
        product: {},
        variants: {},
        isLoadingProduct: false,
        failedLoadingProduct: false
    },
    reducers: {     
        emptyVariants: (state, action) => {
            state.variants = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadProductData.pending, (state) => {
                state.isLoadingProduct = true;
                state.failedLoadingProduct = false;
            })
            .addCase(loadProductData.fulfilled, (state, action) => {
                state.isLoadingProduct = false;
                state.failedLoadingProduct = false;
                state.product.data = action.payload.product;
                state.product.categories = action.payload.categories;
                state.variants = action.payload.variants;
            })
            .addCase(loadProductData.rejected, (state) => {
                state.isLoadingProduct = false;
                state.failedLoadingProduct = true;
            })
    }
})

export const { emptyVariants } = singleProductSlice.actions;
export const selectProductData = (state) => state.singleProduct.product;
export const selectProductVariants = (state) => state.singleProduct.variants;

export const isLoadingProduct = (state) => state.singleProduct.isLoadingProduct;



export default singleProductSlice.reducer;