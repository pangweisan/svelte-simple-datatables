import { writable, derived } from 'svelte/store'
//import { options } from './options.js'
//import { pageNumber, rowCount } from './state.js'
//import { globalFilters, localFilters } from './filters.js'
import { getContext, setContext } from 'svelte'
import { key } from '../key.js'


const createData = () => {
	const { subscribe, set, update } = writable([])
	return {
		subscribe, set,
		sortAsc: (key) => update(store => {
			try {
				store.sort( (a, b) => {
					if (typeof(key(b)) === "boolean") {
						return key(a) ? 1 : -1
					} else {
						return key(b).localeCompare(key(a)) 
					}									
				})

				return store
			} catch (e) {
				return store.sort( (a, b) => parseFloat(key(b)) - parseFloat(key(a)))
			}
			//return store.sort( (a, b) => key(b).localeCompare(key(a)) )
			
		}),
		sortDesc: (key) => update(store => {
			try {
				store.sort( (a, b) => {
					if (typeof(key(b)) === "boolean") {
						return key(a) ? -1 : 1
					} else {
						return key(a).localeCompare(key(b)) 
					}									
				})

				return store					
			} catch (e) {
				return store.sort( (a, b) => parseFloat(key(a)) - parseFloat(key(b)))
			}
			//return store.sort( (a, b) => key(a).localeCompare(key(b)) )
		}),
	}
}
/*
export const data = createData()

export const filtered = derived(
	[data, globalFilters, localFilters],
    ([$data, $globalFilters, $localFilters]) => {
		if ($globalFilters) {
			$data = $data.filter( item => {
				return Object.keys(item).some( k => {
					return item[k].toString().toLowerCase().indexOf($globalFilters.toString().toLowerCase()) > -1
				})
			})
		}
		if ($localFilters.length > 0) {
			$localFilters.forEach(filter => {
				return $data = $data.filter( item => filter.key(item).toString().toLowerCase().indexOf(filter.value.toString().toLowerCase()) > -1)
			})
		}
		rowCount.set($data.length)
		return $data
	} 	
)

export const rows = derived(
	[filtered, options, pageNumber],
    ([$filtered, $options, $pageNumber]) => {
		if (!$options.pagination) {
			return $filtered
		}
		return $filtered.slice( ($pageNumber - 1) * $options.rowPerPage, $pageNumber * $options.rowPerPage) 
	} 
)
*/

function getData(){
	const {options, pageNumber, rowCount, globalFilters, localFilters} = getContext(key);

	const data = createData();

	const filtered = derived(
		[data, globalFilters, localFilters],
		([$data, $globalFilters, $localFilters]) => {
			if ($globalFilters) {
				$data = $data.filter( item => {
					return Object.keys(item).some( k => {
						return item[k].toString().toLowerCase().indexOf($globalFilters.toString().toLowerCase()) > -1
					})
				})
			}
			if ($localFilters.length > 0) {
				$localFilters.forEach(filter => {
					return $data = $data.filter( item => filter.key(item).toString().toLowerCase().indexOf(filter.value.toString().toLowerCase()) > -1)
				})
			}
			rowCount.set($data.length)
			return $data
		} 	
	)	

	const rows = derived(
		[filtered, options, pageNumber],
		([$filtered, $options, $pageNumber]) => {
			if (!$options.pagination) {
				return $filtered
			}
			return $filtered.slice( ($pageNumber - 1) * $options.rowPerPage, $pageNumber * $options.rowPerPage) 
		} 
	)

	return {data, filtered, rows}

}

export function init_module(){
	const ctx = getContext(key);
	const {data, filtered, rows} = getData();

	setContext(key, {...ctx, data, filtered, rows});

}
