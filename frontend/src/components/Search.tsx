import React, { useEffect, useState } from 'react';
import { Data } from '../types';
import { searchData } from '../services/search';
import { Toaster , toast} from 'sonner'
import { useDebounce } from '@uidotdev/usehooks';


const DEBOUNCE_TIME = 350;

const Search = ({initialData} : {initialData: Data} ) => {
    const [data, setData] = useState<Data>(initialData);
    const [search, setSearch] = useState<string>(()=> {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('q') || '';
    }    
    );

    const debouncedSearch = useDebounce(search, DEBOUNCE_TIME);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    useEffect(() => {
        const newPath = debouncedSearch === '' ? window.location.pathname : `?q=${debouncedSearch}`;
        window.history.pushState({}, '', newPath);
    }, [debouncedSearch]);

    //Call the API to get the data
    useEffect(() => {
        if(!debouncedSearch){
            setData(initialData);
            return
        }
        searchData(debouncedSearch).then(response => {
            const [err, newData] = response;
            if(err) {
                toast.error(err.message);
                return;
            }
            if(newData) setData(newData);
        })

    }, [debouncedSearch, initialData]);

    return (
        <div>
            <h1>Search</h1>
            <form>
                <input type="text" placeholder="Search info..."  onChange={handleSearch} defaultValue={search}/>
            </form>
            <ul>
                {data.map((row) => (
                    <li key={row.id}>
                        <article>
                           {
                            Object
                                .entries(row)
                                .map(([key,value]) => (
                                <p key={key}>
                                    <strong>{key}:</strong> {value}
                                </p>
                            ))}
                        </article>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Search;