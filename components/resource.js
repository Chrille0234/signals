import { bindSignalProperties, resource, signal } from "../signal.js";

export class ProductBrowserComponent extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: "open" });

        this.shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                }
                
                .product-browser {
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 0 auto;
                }
                
                .product-info {
                    background: white;
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .product-id {
                    color: #6c757d;
                    font-size: 14px;
                    margin-bottom: 8px;
                }
                
                .product-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                    min-height: 24px;
                    line-height: 1.3;
                }
                
                .controls {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                }
                
                button {
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: background-color 0.2s ease;
                }
                
                button:hover {
                    background: #0056b3;
                }
                
                button:disabled {
                    background: #6c757d;
                    cursor: not-allowed;
                }
                
                button:active {
                    transform: translateY(1px);
                }
            </style>
            
            <div class="product-browser">
                <h3>Brows products</h3>
                <div class="product-info">
                    <div class="product-id">Product ID: {{product_id}}</div>
                    <div class="product-title">{{product.title}}</div>
                    <div class="product-title">{{product.price}}</div>
                </div>
                
                <div class="controls">
                    <button id="previousProductBtn">← Previous</button>
                    <button id="nextProductBtn">Next →</button>
                </div>
            </div>
        `

        async function getProductById(id){
            const res = await fetch(`https://dummyjson.com/products/${id}`)
            return await res.json()
        }
        
        this.productId = signal(1, "product_id", this.shadow)
        this.product = resource({
            fn: async () => getProductById(this.productId),
            defaultValue: {
                title: "Loading...",
                price: 0.00,
            }
        })
        bindSignalProperties(this.product.result, {
            name: "product",
            properties: ["title", "price"]
        }, this.shadow)
    }
    
    connectedCallback(){
        const nextBtn = this.shadow.getElementById("nextProductBtn")
        const prevBtn = this.shadow.getElementById("previousProductBtn")

        prevBtn.addEventListener("click", () => {
            if(this.productId <= 1) return;
            this.productId.update(prev => --prev)
        })
        
        nextBtn.addEventListener("click", () => {
            this.productId.update(prev => ++prev)
        })
    }
}

customElements.define("product-browser", ProductBrowserComponent);