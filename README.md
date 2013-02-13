# scale

Redimensionamiento de imágenes con Node.js

## Prueba

```
http://localhost:8888/?w=600&h=600&u=http://1.bp.blogspot.com/-wvFNX3VitBc/TVqznx9X_YI/AAAAAAAAAuc/srwDIMNnCYE/s1600/capybara2.jpg
```

## Parámetros obligatorios usando GET

### h

**Height** - La altura que se desea.

### w

**Width** - El ancho.

**n.b.** si solamente se especifica **h** o **w** , el otro parámetro se queda sin modificar

### u

**URL** - El URL de la imagen.

## Parámetros opcionales (GET)

### g

**Gravity** - la imagen será modificada para acomodar las dimensiones requeridas. Por dafault, scale hace un crop centrado, pero es posible dirigir el mismo usando esta opción.  
Posibles parámetros **g**:

- Center (default)
- NorthWest
- North
- NorthEast
- West
- East
- SouthWest
- South
- SouthEast

(el case no es necesario)

### d

**Download** - Agrega este parámetro a tu query (y un valor de 1 o true) para automáticamente descargar la imagen en lugar de solamente desplegarla en el browser.

### IMPORTANTE

- Este código asume que el URL es válido.
