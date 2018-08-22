import { PropTypes } from "prop-types";
import * as React from "react";

import { ProductSearchResult } from "../../../api/models";
import { AppContext } from "../../../app";
import Button, { ButtonSize, ButtonVariant } from "../../../components/button";
import Image, { ImageFitVariant, ImageRatioVariant } from "../../../components/image";
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
                                <form
                                    className="product-search-input"
                                    onSubmit={this._onFormKeyDown}
                                >
                                    <Input value={this.state.searchTerm} onChange={this._onSearchTermChange} />
                                    <Button inline variant={ButtonVariant.OUTLINE} onClick={this._search}>Search</Button>
                                </form>
                                <div className="product-search-results">
                                    {this.state.searchResults.map(result => (
                                        <div className="product-search-result">
                                            <Image fit={ImageFitVariant.SCALED} ratio={ImageRatioVariant.PRODUCT_IMAGE} className="product-image" src={result.image} />
                                            <div className="product-search-result-detail">
                                                <div className="product-search-label">
                                                    Brand
                                                </div>
                                                <div className="product-search-info">{result.brand}</div>
                                                <div className="product-search-label">
                                                    Retailer
                                                </div>
                                                <div className="product-search-info">{result.merchant}</div>
                                                <div className="product-search-label">
                                                    Name
                                                </div>
                                                <div className="product-search-info">{result.title}</div>
                                                <div className="product-search-label">
                                                    Price
                                                </div>
                                                <div className="product-search-info">{result.price}</div>
                                                <div className="divider" />
                                                <Button
                                                    variant={ButtonVariant.OUTLINE}
                                                    size={ButtonSize.VERY_SMALL}
                                                    onClick={() => this.props.selectProduct(result)}
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="tagged-products">
                                <div className="product-search-title">Tagged Products</div>
                                {this.props.selectedProducts.map(selectedProduct => (
                                    <>
                                        <div className="tagged-product">
                                            <img className="tagged-product-img" src={selectedProduct.image} />
                                            <div>
                                                <div className="product-search-label">
                                                    Brand
                                                </div>
                                                <div className="product-search-info">{selectedProduct.brand}</div>
                                                <div className="product-search-label">
                                                    Title
                                                </div>
                                                <div className="product-search-info">{selectedProduct.title}</div>
                                                <div className="product-search-label">
                                                    Price
                                                </div>
                                                <div className="product-search-info">{selectedProduct.price}</div>
                                            </div>
                                        </div>
                                        <Button
                                            inline
                                            variant={ButtonVariant.OUTLINE}
                                            size={ButtonSize.VERY_SMALL}
                                            onClick={() => this.props.removeProduct(selectedProduct)}
                                        >
                                            Remove
                                        </Button>
                                    </>
                                ))}
                            </div>
                        </div>
                    </Modal>
                )}
            </>
        );
    }

    private _onFormKeyDown = (event) => {
        event.preventDefault();
        this._search();
        return false;
    }

    private _search = async () => {
        const searchResults = await this.context.api.searchProducts(`?keywords=${this.state.searchTerm}`);
        this.setState({ searchResults });
        return false;
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
