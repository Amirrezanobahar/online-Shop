import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageUploader from './ImageUploader';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton, Snackbar, Alert, Chip,
  Select, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel,
  Autocomplete, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { Edit, Delete, Add, ExpandMore } from '@mui/icons-material';

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expandedColor, setExpandedColor] = useState(null);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    isFeatured: false,
    subCategories: []
  });
  const [newSubCategory, setNewSubCategory] = useState('');
  const [openBrandDialog, setOpenBrandDialog] = useState(false);
  const [newBrand, setNewBrand] = useState({
    name: '',
    description: '',
    logo: '',
    isFeatured: false
  });


  // حالت اولیه محصول
  const initialProductState = {
    name: '',
    brand: '',
    category: '',
    subCategory: '',
    price: 0,
    discount: 0,
    stock: 0,
    sold: 0,
    colors: [],
    sizes: [],
    skinTypes: [],
    ingredients: [],
    expiryDate: '',
    description: '',
    features: [],
    howToUse: '',
    warnings: '',
    images: [],
    videoUrl: '',
    isFeatured: false,
    isNewProduct: false,
    tags: []
  };

  // حالت اولیه رنگ
  const initialColorState = {
    name: '',
    hexCode: '#ffffff',
    sizes: [],
    skinTypes: [],
    ingredients: [],
    weight: {
      value: 0,
      unit: 'g'
    }
  };

  const [selectedImages, setSelectedImages] = useState([]);

  // توابع مدیریت تصاویر
  // در بخش توابع کامپوننت
  const handleAddImages = (files) => {
    // اعتبارسنجی تعداد تصاویر
    if (selectedImages.length + files.length > 5) {
      showSnackbar('حداکثر 5 تصویر مجاز است', 'error');
      return;
    }

    // تبدیل فایل‌ها به پیش‌نمایش
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      altText: `تصویر محصول ${selectedImages.length + 1}`
    }));

    setSelectedImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAltTextChange = (index, text) => {
    setSelectedImages(prev => prev.map((img, i) =>
      i === index ? { ...img, altText: text } : img
    ));
  };

  // دریافت داده‌ها
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, brandsRes, categoriesRes] = await Promise.all([
          axios.get('http://127.0.0.1:5000/product/'),
          axios.get('http://127.0.0.1:5000/brand/'),
          axios.get('http://127.0.0.1:5000/category/')
        ]);

        setProducts(productsRes.data);
        setBrands(brandsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        showSnackbar('خطا در دریافت داده‌ها', 'error');
      }
    };

    fetchData();
  }, []);

  // توابع کمکی
  const handleOpenCategoryDialog = () => {
    setOpenCategoryDialog(true);
  };

  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
    setNewCategory({
      name: '',
      description: '',
      isFeatured: false,
      subCategories: []
    });
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleAddSubCategory = () => {
    if (newSubCategory.trim()) {
      setNewCategory({
        ...newCategory,
        subCategories: [...newCategory.subCategories, { name: newSubCategory }]
      });
      setNewSubCategory('');
    }
  };

  const handleRemoveSubCategory = (index) => {
    const updatedSubCategories = [...newCategory.subCategories];
    updatedSubCategories.splice(index, 1);
    setNewCategory({ ...newCategory, subCategories: updatedSubCategories });
  };

  const handleCreateCategory = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/category', newCategory);

      showSnackbar('دسته‌بندی با موفقیت ایجاد شد', 'success');
      // Refresh categories list
      const res = await axios.get('http://127.0.0.1:5000/category');
      setCategories(res.data);
      handleCloseCategoryDialog();
    } catch (error) {
      showSnackbar('خطا در ایجاد دسته‌بندی', 'error');
    }
  };
  const handleOpenBrandDialog = () => {

    setOpenBrandDialog(true);
  };

  const handleCloseBrandDialog = () => {
    setOpenBrandDialog(false);
    setNewBrand({
      name: '',
      description: '',
      logo: '',
      isFeatured: false
    });
  };

  const handleBrandInputChange = (e) => {
    const { name, value } = e.target;
    setNewBrand({ ...newBrand, [name]: value });
  };

  const handleCreateBrand = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/brand', newBrand);
      showSnackbar('برند با موفقیت ایجاد شد', 'success');

      // بروزرسانی لیست برندها
      const res = await axios.get('http://127.0.0.1:5000/brand');
      setBrands(res.data);

      handleCloseBrandDialog();
    } catch (error) {
      showSnackbar('خطا در ایجاد برند', 'error');
    }
  };
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (product = null) => {
    setCurrentProduct(product ? {
      ...product,
      expiryDate: product.expiryDate?.split('T')[0] || '',
      colors: product.colors?.map(color => ({
        ...color,
        skinTypes: Array.isArray(color.skinTypes) ? color.skinTypes : [color.skinTypes].filter(Boolean)
      })) || []
    } : { ...initialProductState });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleColorInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedColors = [...currentProduct.colors];
    updatedColors[index] = { ...updatedColors[index], [name]: value };
    setCurrentProduct({ ...currentProduct, colors: updatedColors });
  };

  const handleWeightChange = (colorIndex, field, value) => {
    const updatedColors = [...currentProduct.colors];
    updatedColors[colorIndex] = {
      ...updatedColors[colorIndex],
      weight: {
        ...updatedColors[colorIndex].weight,
        [field]: field === 'value' ? Number(value) : value
      }
    };
    setCurrentProduct({ ...currentProduct, colors: updatedColors });
  };

  const handleAddColor = () => {
    setCurrentProduct({
      ...currentProduct,
      colors: [...currentProduct.colors, { ...initialColorState }]
    });
  };

  const handleRemoveColor = (index) => {
    const updatedColors = [...currentProduct.colors];
    updatedColors.splice(index, 1);
    setCurrentProduct({ ...currentProduct, colors: updatedColors });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
  
      // افزودن تصاویر
      selectedImages.forEach((image) => {
        formData.append('images', image.file);
        formData.append('altTexts', image.altText);
      });
  
      // افزودن سایر داده‌ها
      const productData = {
        ...currentProduct,
        price: Number(currentProduct.price),
        discount: Number(currentProduct.discount),
        stock: Number(currentProduct.stock),
        sold: Number(currentProduct.sold),
        expiryDate: currentProduct.expiryDate ? new Date(currentProduct.expiryDate).toISOString() : null,
        colors: currentProduct.colors?.map(color => ({
          ...color,
          weight: {
            value: Number(color.weight?.value || 0),
            unit: color.weight?.unit || 'g'
          }
        }))
      };
  
      Object.entries(productData).forEach(([key, value]) => {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
      });
  
      let response;
  
      if (currentProduct._id) {
        response = await axios.put(`http://127.0.0.1:5000/product/${currentProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showSnackbar(`محصول "${response.data.title}" با موفقیت ویرایش شد`, 'success');
      } else {
        response = await axios.post('http://127.0.0.1:5000/product', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showSnackbar(`محصول "${response.data.title}" با موفقیت اضافه شد`, 'success');
      }
  
      // Refresh data
      const res = await axios.get('http://127.0.0.1:5000/product/');
      setProducts(res.data);
      handleCloseDialog();
  
    } catch (error) {
      showSnackbar('خطا در ذخیره محصول', 'error');
      console.error('Error saving product:', error);
    }
  };
  


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/product/${id}`);
      showSnackbar('محصول با موفقیت حذف شد', 'success');
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      showSnackbar('خطا در حذف محصول', 'error');
    }
  };

  // گزینه‌های انتخابی
  const subCategoryOptions = ['رژلب', 'خط چشم', 'کرم پودر', 'ریمل', 'سایه چشم'];
  const skinTypeOptions = ['چرب', 'خشک', 'مختلط', 'حساس'];
  const weightUnits = ['g', 'ml'];

  return (
    <Box sx={{ p: 3 }}>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">مدیریت محصولات آرایشی</Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            mb: 3
          }}
        >
          <Button
            variant="contained"
            onClick={handleOpenBrandDialog}
            startIcon={<Add />}
            sx={{
              bgcolor: '#4CAF50', // سبز
              '&:hover': { bgcolor: '#45a049' },
              minWidth: 180,
              borderRadius: '8px',
              boxShadow: 2,
              transition: 'all 0.3s ease'
            }}
          >
            افزودن برند جدید
          </Button>

          <Button
            variant="contained"
            onClick={handleOpenCategoryDialog}
            startIcon={<Add />}
            sx={{
              bgcolor: '#2196F3', // آبی
              '&:hover': { bgcolor: '#1976D2' },
              minWidth: 180,
              borderRadius: '8px',
              boxShadow: 2,
              transition: 'all 0.3s ease'
            }}
          >
            افزودن دسته‌بندی
          </Button>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              bgcolor: '#9C27B0', // بنفش
              '&:hover': { bgcolor: '#7B1FA2' },
              minWidth: 180,
              borderRadius: '8px',
              boxShadow: 3,
              transition: 'all 0.3s ease',
              transform: 'scale(1.05)'
            }}
          >
            افزودن محصول جدید
          </Button>
        </Box>
      </Box>


      {/* جدول محصولات */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ textAlign: 'center' }}>
            <TableRow style={{ textAlign: 'center' }}>
              <TableCell sx={{ width: '15%', minWidth: 200 }} style={{ textAlign: 'center' }}  >نام محصول</TableCell>
              <TableCell sx={{ width: '25%', minWidth: 150 }} style={{ textAlign: 'center' }} >برند</TableCell>
              <TableCell sx={{ width: '15%', minWidth: 120 }} style={{ textAlign: 'center' }}>قیمت</TableCell>
              <TableCell sx={{ width: '10%', minWidth: 100 }} style={{ textAlign: 'center' }} >موجودی</TableCell>
              <TableCell sx={{ width: '25%', minWidth: 200 }} style={{ textAlign: 'center' }}>رنگ‌ها</TableCell>
              <TableCell sx={{ width: '10%', minWidth: 100 }} style={{ textAlign: 'center' }}>عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell style={{ textAlign: 'center' }}>{product.name}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  {brands.find(b => b._id === product.brand)?.name || product.brand.name}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>{product.price.toLocaleString('fa-IR')} تومان</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{product.stock}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 1 }} style={{ display: 'flex', justifyContent: "center" }}>
                    {product.colors?.map((color, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: color.hexCode,
                          borderRadius: '50%',
                          border: '1px solid #ddd'
                        }}
                        title={color.name}
                      />
                    ))}
                  </Box>

                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <IconButton onClick={() => handleOpenDialog(product)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product._id)}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentProduct?._id ? 'ویرایش محصول' : 'افزودن محصول جدید'}
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>

            {/* --- اطلاعات پایه --- */}
            <Typography variant="h6" sx={{ gridColumn: '1 / -1' }}>
              اطلاعات پایه
            </Typography>

            <TextField
              name="name"
              label="نام محصول*"
              value={currentProduct?.name || ''}
              onChange={handleProductInputChange}
              fullWidth
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>برند*</InputLabel>
              <Select
                name="brand"
                value={currentProduct?.brand || ''}
                onChange={handleProductInputChange}
                label="برند"
              >
                {brands?.map((brand) => (
                  <MenuItem key={brand._id} value={brand._id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>دسته‌بندی*</InputLabel>
              <Select
                name="category"
                value={currentProduct?.category || ''}
                onChange={handleProductInputChange}
                label="دسته‌بندی"
              >
                {categories?.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>زیردسته‌بندی</InputLabel>
              <Select
                name="subCategory"
                value={currentProduct?.subCategory || ''}
                onChange={handleProductInputChange}
                label="زیردسته‌بندی"
              >
                {subCategoryOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* --- قیمت و موجودی --- */}
            <Typography variant="h6" sx={{ gridColumn: '1 / -1', mt: 2 }}>
              قیمت و موجودی
            </Typography>

            <TextField
              name="price"
              label="قیمت (تومان)*"
              type="number"
              value={currentProduct?.price || 0}
              onChange={handleProductInputChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 1000 }}
            />

            <TextField
              name="discount"
              label="تخفیف (%)"
              type="number"
              value={currentProduct?.discount || 0}
              onChange={handleProductInputChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 0, max: 100 }}
            />

            <TextField
              name="stock"
              label="موجودی*"
              type="number"
              value={currentProduct?.stock || 0}
              onChange={handleProductInputChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 0 }}
            />

            <TextField
              name="sold"
              label="تعداد فروخته شده"
              type="number"
              value={currentProduct?.sold || 0}
              onChange={handleProductInputChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 0 }}
            />

            {/* --- تاریخ انقضا و توضیحات --- */}
            <Typography variant="h6" sx={{ gridColumn: '1 / -1', mt: 2 }}>
              توضیحات و تاریخ انقضا
            </Typography>

            <TextField
              name="expiryDate"
              label="تاریخ انقضا"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={currentProduct?.expiryDate || ''}
              onChange={handleProductInputChange}
              fullWidth
              margin="normal"
            />

            <TextField
              name="description"
              label="توضیحات محصول*"
              value={currentProduct?.description || ''}
              onChange={handleProductInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />

            <TextField
              name="features"
              label="ویژگی‌ها (با کاما جدا کنید)"
              value={currentProduct?.features?.join(', ') || ''}
              onChange={(e) => {
                setCurrentProduct({
                  ...currentProduct,
                  features: e.target.value.split(',').map(item => item.trim())
                });
              }}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />

            {/* --- رنگ‌ها --- */}
            <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                رنگ‌ها
                <Button
                  onClick={handleAddColor}
                  size="small"
                  sx={{ ml: 2 }}
                  startIcon={<Add />}
                >
                  افزودن رنگ
                </Button>
              </Typography>

              {currentProduct?.colors?.map((color, index) => (
                <Accordion
                  key={index}
                  expanded={expandedColor === index}
                  onChange={() => setExpandedColor(expandedColor === index ? null : index)}
                  sx={{ mb: 1, borderRadius: 2, boxShadow: 1 }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          backgroundColor: color.hexCode,
                          borderRadius: '50%',
                          border: '1px solid #ddd'
                        }}
                      />
                      <Typography>{color.name || `رنگ ${index + 1}`}</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 1 }}>

                      {/* نام رنگ و کد رنگ */}
                      <TextField
                        name="name"
                        label="نام رنگ"
                        value={color.name || ''}
                        onChange={(e) => handleColorInputChange(index, e)}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        name="hexCode"
                        label="کد رنگ"
                        type="color"
                        value={color.hexCode || '#ffffff'}
                        onChange={(e) => handleColorInputChange(index, e)}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                      />

                      {/* انواع پوست */}
                      <Autocomplete
                        multiple
                        options={skinTypeOptions}
                        value={color.skinTypes || []}
                        onChange={(e, newValue) => {
                          const updatedColors = [...currentProduct.colors];
                          updatedColors[index].skinTypes = newValue;
                          setCurrentProduct({ ...currentProduct, colors: updatedColors });
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="انواع پوست مناسب" margin="normal" />
                        )}
                      />

                      {/* وزن و واحد */}
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                          label="وزن"
                          type="number"
                          value={color.weight?.value || 0}
                          onChange={(e) => handleWeightChange(index, 'value', e.target.value)}
                          fullWidth
                          margin="normal"
                          inputProps={{ min: 0 }}
                        />
                        <FormControl fullWidth margin="normal">
                          <InputLabel>واحد</InputLabel>
                          <Select
                            value={color.weight?.unit || 'g'}
                            onChange={(e) => handleWeightChange(index, 'unit', e.target.value)}
                            label="واحد"
                          >
                            {weightUnits.map((unit) => (
                              <MenuItem key={unit} value={unit}>
                                {unit}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>

                      {/* مواد تشکیل‌دهنده */}
                      <TextField
                        name="ingredients"
                        label="مواد تشکیل‌دهنده (با کاما جدا کنید)"
                        value={color.ingredients?.join(', ') || ''}
                        onChange={(e) => {
                          const updatedColors = [...currentProduct.colors];
                          updatedColors[index].ingredients = e.target.value.split(',').map(item => item.trim());
                          setCurrentProduct({ ...currentProduct, colors: updatedColors });
                        }}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={2}
                      />

                      {/* دکمه حذف رنگ */}
                      <Box>
                        <Button
                          onClick={() => handleRemoveColor(index)}
                          color="error"
                          variant="outlined"
                          size="small"
                          startIcon={<Delete />}
                        >
                          حذف این رنگ
                        </Button>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            {/* --- سایر تنظیمات --- */}
            <Box sx={{ gridColumn: '1 / -1', display: 'flex', gap: 2, mt: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isFeatured"
                    checked={currentProduct?.isFeatured || false}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, isFeatured: e.target.checked })}
                  />
                }
                label="محصول ویژه"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="isNewProduct"
                    checked={currentProduct?.isNewProduct || false}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, isNewProduct: e.target.checked })}
                  />
                }
                label="محصول جدید"
              />

              <ImageUploader
                images={selectedImages}
                onAdd={handleAddImages}
                onRemove={handleRemoveImage}
                onAltTextChange={handleAltTextChange}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            انصراف
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            ذخیره محصول
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openBrandDialog} onClose={handleCloseBrandDialog} maxWidth="sm" fullWidth>
        <DialogTitle>ایجاد برند جدید</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mt: 2 }}>
            <TextField
              name="name"
              label="نام برند*"
              value={newBrand.name}
              onChange={handleBrandInputChange}
              fullWidth
              margin="normal"
            />

            <TextField
              name="description"
              label="توضیحات"
              value={newBrand.description}
              onChange={handleBrandInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />

            <TextField
              name="logo"
              label="آدرس لوگو"
              value={newBrand.logo}
              onChange={handleBrandInputChange}
              fullWidth
              margin="normal"
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="isFeatured"
                  checked={newBrand.isFeatured}
                  onChange={(e) => setNewBrand({ ...newBrand, isFeatured: e.target.checked })}
                />
              }
              label="برند ویژه"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBrandDialog} color="secondary">
            انصراف
          </Button>
          <Button onClick={handleCreateBrand} color="primary" variant="contained">
            ایجاد برند
          </Button>
        </DialogActions>
      </Dialog>
      {/* دیالوگ ایجاد دسته‌بندی جدید */}
      <Dialog open={openCategoryDialog} onClose={handleCloseCategoryDialog} maxWidth="sm" fullWidth>
        <DialogTitle>ایجاد دسته‌بندی جدید</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mt: 2 }}>
            <TextField
              name="name"
              label="نام دسته‌بندی*"
              value={newCategory.name}
              onChange={handleCategoryInputChange}
              fullWidth
              margin="normal"
            />

            <TextField
              name="description"
              label="توضیحات"
              value={newCategory.description}
              onChange={handleCategoryInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="isFeatured"
                  checked={newCategory.isFeatured}
                  onChange={(e) => setNewCategory({ ...newCategory, isFeatured: e.target.checked })}
                />
              }
              label="دسته‌بندی ویژه"
            />

            <Typography variant="subtitle1" sx={{ mt: 2 }}>زیردسته‌بندی‌ها</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <TextField
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                label="نام زیردسته"
                fullWidth
              />
              <Button
                onClick={handleAddSubCategory}
                variant="outlined"
              >
                افزودن
              </Button>
            </Box>

            <Box sx={{ mt: 2 }}>
              {newCategory.subCategories.map((subCat, index) => (
                <Chip
                  key={index}
                  label={subCat.name}
                  onDelete={() => handleRemoveSubCategory(index)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCategoryDialog} color="secondary">
            انصراف
          </Button>
          <Button onClick={handleCreateCategory} color="primary" variant="contained">
            ایجاد دسته‌بندی
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsAdmin;