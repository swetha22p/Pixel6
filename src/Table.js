import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import logo from './images/pixel.png';
import { useNavigate } from 'react-router-dom';

// Styled TableCell for header
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  fontFamily: 'Arial, sans-serif',
}));

const columns = [
  { id: 'id', label: 'ID', minWidth: 100 },
  { id: 'image', label: 'Image', minWidth: 100, format: (value) => <img src={value} alt="user" width="50" height="50" /> },
  { id: 'fullName', label: 'Full Name', minWidth: 170 },
  { id: 'demography', label: 'Demography', minWidth: 170, align: 'right' },
  { id: 'designation', label: 'Designation', minWidth: 170, align: 'right' },
  { id: 'location', label: 'Location', minWidth: 170, align: 'right' },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function StickyHeadTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [countryFilter, setCountryFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const limit = 30;
        const skip = page * rowsPerPage;

        const response = await axios.get('https://dummyjson.com/users', {
          params: {
            limit,
            skip
          }
        });

        const users = response.data.users.map((user) => ({
          id: user.id,
          image: user.image,
          fullName: `${user.firstName} ${user.lastName}`,
          demography: `${user.gender === "male" ? "M" : "F"} / ${user.age}`,
          designation: user.company.title,
          location: `${user.address.state}, ${user.address.country === 'United States' ? 'USA' : user.address.country}`,
        }));

        setRows(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [page, rowsPerPage]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredRows = rows.filter(row => 
    (countryFilter === '' || row.location.includes(countryFilter)) &&
    (genderFilter === '' || row.demography.includes(genderFilter))
  );

  const handleMapDataNavigation = () => {
    navigate('/mapdata');
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', margin: '16px' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src={logo} alt="logo" style={{ width: '50px', height: '50px' }} />
          <h2 style={{ margin: 0 }}>Employees</h2>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'flex-end' }}>
          <IconButton onClick={handleMapDataNavigation}>
            <MapsUgcIcon />
          </IconButton>
          <IconButton>
            <FilterListIcon />
          </IconButton>
          <Select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            displayEmpty
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">Country</MenuItem>
            <MenuItem value="USA">USA</MenuItem>
            <MenuItem value="India">India</MenuItem>
            <MenuItem value="China">China</MenuItem>
            {/* Add more country options as needed */}
          </Select>
          <Select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            displayEmpty
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">Gender</MenuItem>
            <MenuItem value="M">Male</MenuItem>
            <MenuItem value="F">Female</MenuItem>
            {/* Add more gender options as needed */}
          </Select>
        </div>
      </CardContent>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 740 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <StyledTableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    {['id', 'fullName'].includes(column.id) ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={(event) => handleRequestSort(event, column.id)}
                        IconComponent={() => (
                          <div>
                            <ArrowUpwardIcon
                              style={{ color: orderBy === column.id && order === 'asc' ? 'black' : 'grey' }}
                            />
                            <ArrowDownwardIcon
                              style={{ color: orderBy === column.id && order === 'desc' ? 'black' : 'grey' }}
                            />
                          </div>
                        )}
                      >
                        {column.label}
                        {orderBy === column.id ? (
                          <span style={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </span>
                        ) : null}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(filteredRows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'string'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Card>
  );
}
