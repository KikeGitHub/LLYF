from PIL import Image, ImageChops

def extract_logos(image_path):
    img = Image.open(image_path).convert('RGB')
    # Background color is at the top right pixel
    bg_color = img.getpixel((img.width - 1, 0))
    
    # Create a difference map (distance from bg_color)
    diff = ImageChops.difference(img, Image.new('RGB', img.size, bg_color))
    # Convert diff to grayscale
    diff = diff.convert('L')
    # Threshold: anything > a small noise threshold is considered 'content'
    threshold = 10
    mask = diff.point(lambda p: p > threshold and 255)
    
    # We'll use scipy/skimage to find connected components if we had it, but we can do a simple projection
    # Actually, PIL doesn't have connected components. Let's just hardcode approximate boxes 
    # since we know the layout. Width: 1017, Height: 492
    
    # The word "CLIENTES" is at the top left. Let's ignore Y from 0 to 180.
    
    # Row 1 is approx Y: 180 to 280
    # Aldea: X: 150 to 350
    # Posadas: X: 360 to 650
    # Aileron: X: 670 to 950
    
    # Row 2 is approx Y: 300 to 450
    # Eclectica: X: 220 to 520
    # Methode: X: 530 to 820
    
    # Let's refine the numbers visually based on proportion 1017x492
    boxes = [
        (130, 200, 310, 280), # Aldea
        (330, 200, 620, 280), # Posadas
        (650, 200, 930, 280), # Aileron
        (250, 310, 500, 420), # Eclectica
        (510, 310, 780, 420)  # Methode
    ]
    
    paths = []
    for i, box in enumerate(boxes):
        cropped = img.crop(box)
        # trim it to exact bounds
        c_bg = cropped.getpixel((0,0))
        c_diff = ImageChops.difference(cropped, Image.new('RGB', cropped.size, c_bg))
        bbox = c_diff.convert('L').point(lambda p: p > 10 and 255).getbbox()
        if bbox:
            cropped = cropped.crop(bbox)
        
        path = f"assets/logo_{i+1}.png"
        cropped.save(path)
        paths.append(path)

extract_logos('assets/clientes.png')
print("Logos extracted.")
