import { PropTypes } from "prop-types";
import * as React from "react";

import { ProductSearchResult } from "../../../api/models";
import { AppContext } from "../../../app";
import Button from "../../../components/button";
import Image from "../../../components/image";
import Input from "../../../components/input";
import Modal from "../../../components/modal";
import { ProductSearchTag } from "../types";

import "./style.scss";

interface ProductSearchModalProps {
    selectedProducts: Array<ProductSearchTag>;
    selectProduct(product: ProductSearchTag): void;
    removeProduct(product: ProductSearchTag): void;
}

interface ProductSearchModalState {
    modalOpen: boolean;
    searchTerm: string;
    searchResults: Array<ProductSearchResult>;
}

export default class ProductSearchModal extends React.Component<ProductSearchModalProps, ProductSearchModalState> {
    static contextTypes: AppContext;

    state: ProductSearchModalState = {
        modalOpen: false,
        searchTerm: "",
        searchResults: [],
    };

    render() {
        return (
            <>
                <Button onClick={this._openModal}>Select Products</Button>
                {this.props.selectedProducts.length}
                {this.state.modalOpen && (
                    <Modal isOpen={this.state.modalOpen} close={this._closeModal} className="product-tag-modal">
                        <div className="product-search-modal-container">
                            <div className="product-search">
                                <Input value={this.state.searchTerm} onChange={this._onSearchTermChange} />
                                <Button onClick={this._search}>Search</Button>
                                <div className="product-search-results">
                                    {this.state.searchResults.map(result => (
                                        <div className="product-search-result">
                                            <Image className="product-image" src={result.image} />
                                            <div className="product-search-result-detail">
                                                <div className="product-search-label">
                                                    Brand
                                                </div>
                                                {result.brand}
                                                <div className="product-search-label">
                                                    Retailer
                                                </div>
                                                {result.merchant}
                                                <div className="product-search-label">
                                                    Name
                                                </div>
                                                {result.title}
                                                <div className="product-search-label">
                                                    Price
                                                </div>
                                                {result.price}
                                                <Button onClick={() => this.props.selectProduct(result)}>Add Product</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="tagged-products">
                                Tagged Products
                                {this.props.selectedProducts.map(selectedProduct => (
                                    <div className="tagged-product">
                                        {selectedProduct.title}
                                        <Button inline onClick={() => this.props.removeProduct(selectedProduct)}>Remove</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Modal>
                )}
            </>
        );
    }

    private _search = async () => {
        const searchResults = await this.context.api.searchProducts(`?keywords=${this.state.searchTerm}`);
        this.setState({ searchResults });
    }

    private _onSearchTermChange = (searchTerm: string) => {
        this.setState({ searchTerm });
    }

    private _closeModal = () => {
        this.setState({ modalOpen: false });
    }

    private _openModal = () => {
        this.setState({ modalOpen: true });
    }
}

ProductSearchModal.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
