export interface SearchFilterProps {
    searchValue: string;
    placeholder?: string;
    onSearch(value: string): void;
}
