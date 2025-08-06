# DesignSphere 🎨✨

Welcome to **DesignSphere**, the grooviest platform where designers and clients collide in a whirlwind of creativity! 🚀 Think Instagram meets a design marketplace with a sprinkle of magic. Whether you're a designer showcasing your masterpieces or a client hunting for that *perfect* design (like a car against a bright wall 😎), we’ve got you covered. Built with Django and React Native, this app is your ticket to a seamless, stylish, and downright fun design booking experience.

---

## 🌟 What's DesignSphere All About?

DesignSphere is the ultimate playground for designers to flaunt their work and for clients to snag their dream designs. With a sleek, Instagram-inspired UI, you can browse, like, share, and book designs faster than you can say "pixel perfection!" 📸💼

### Key Features
- **Browse Designs**: Scroll through stunning designs with a smooth, Instagram-like feed. 😍
- **Book with Ease**: Click a post and jump straight to booking—because who has time for extra steps? 🕒
- **Designer Profiles**: Check out designer portfolios and drool over their creativity. 🖌️
- **Notifications**: Designers get instant alerts when their work gets booked. Ding! 🔔
- **Secure Authentication**: Log in, sign up, or log out with Django’s token-based auth. 🔒
- **Mobile Magic**: Built with React Native for a buttery-smooth mobile experience on iOS and Android. 📱

---

## 😂 Why DesignSphere is the Coolest Thing Since Sliced Bread

- **Sleek UI**: Our app looks so good, it could walk the runway at Fashion Week. 💃
- **Fast Bookings**: Book a design quicker than you can decide on pizza toppings. 🍕
- **Designer Stardom**: Designers, get ready to shine brighter than a supernova! 🌟
- **Client Power**: Clients, find your dream design and seal the deal with a tap. 🖱️
- **Error Handling**: If something goes wrong, we’ll catch it with a net and a smile. 😄

---

## 🛠️ Getting Started: Launch Your Design Adventure!

Ready to dive into the DesignSphere universe? Follow these steps to get the app up and running. Don’t worry, it’s easier than assembling IKEA furniture! 🪚

### Prerequisites
- **Backend**:
  - Python 3.8+
  - Django 5.x
  - Django REST Framework
  - PostgreSQL (or SQLite for testing)
  - `django-cors-headers` for frontend-backend communication
- **Frontend**:
  - Node.js 18+
  - Expo CLI
  - React Native
  - TypeScript (because we’re fancy like that)
- **Git**: To clone this masterpiece
- **A Sense of Humor**: To appreciate this README 😜

### Installation

#### 1. Clone the Repo
Grab the code from the GitHub galaxy:

```bash
git clone https://github.com/MohamadKamardin1/design_full.git
cd design_full
```

#### 2. Backend Setup (Django) 🐍

1. **Create a Virtual Environment**:
   ```bash
   python -m venv env
   source env/bin/activate  # Windows: env\Scripts\activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install django djangorestframework django-cors-headers
   ```

3. **Configure Settings**:
   Update `backend/api/settings.py`:
   ```python
   INSTALLED_APPS = [
       'corsheaders',
       'rest_framework',
       'rest_framework.authtoken',
       'api',  # Your app name
   ]

   MIDDLEWARE = [
       'corsheaders.middleware.CorsMiddleware',
       ...
   ]

   CORS_ALLOW_ALL_ORIGINS = True

   REST_FRAMEWORK = {
       'DEFAULT_AUTHENTICATION_CLASSES': ['rest_framework.authentication.TokenAuthentication'],
       'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.IsAuthenticated'],
   }

   MEDIA_URL = '/design_images/'
   MEDIA_ROOT = os.path.join(BASE_DIR, 'design_images')
   ```

4. **Run Migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a Superuser** (for admin access):
   ```bash
   python manage.py createsuperuser
   ```

6. **Start the Django Server**:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

7. **Test the API**:
   Create a client user and get a token:
   ```python
   from django.contrib.auth import get_user_model
   from rest_framework.authtoken.models import Token
   User = get_user_model()
   user = User.objects.create_user(username='testclient', password='testpass', role='client')
   token = Token.objects.create(user=user)
   print(token.key)  # Use this in frontend
   ```
   Test the booking endpoint:
   ```bash
   curl -X POST -H "Authorization: Token <your-token>" -H "Content-Type: application/json" -d '{"design": 4, "booking_date": "2025-08-10", "negotiated_price": 200.00, "notes": "Custom color scheme"}' http://localhost:8000/api/bookings/
   ```

#### 3. Frontend Setup (React Native) 📱

1. **Navigate to Frontend Directory**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   npm install expo-linear-gradient react-native-animatable axios @expo/vector-icons @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
   npm install --save-dev typescript @types/react @types/react-native @types/react-native-animatable
   ```

3. **Configure TypeScript**:
   Ensure `tsconfig.json` exists:
   ```json
   {
     "extends": "expo/tsconfig.base",
     "compilerOptions": {
       "strict": true,
       "jsx": "react-native",
       "esModuleInterop": true,
       "skipLibCheck": true,
       "moduleResolution": "node",
       "allowSyntheticDefaultImports": true,
       "noImplicitAny": true,
       "baseUrl": ".",
       "paths": {
         "*": ["src/*"]
       }
     },
     "include": ["**/*.ts", "**/*.tsx"],
     "exclude": ["node_modules"]
   }
   ```

4. **Update API URL**:
   In `HomeScreen.tsx` and `BookingScreen.tsx`, use:
   - Physical device: `http://<your-local-ip>:8000` (e.g., `http://192.168.1.55:8000`)
   - Android emulator: `http://10.0.2.2:8000`

5. **Run the App**:
   ```bash
   npx expo start
   ```
   Press `a` for Android emulator or scan the QR code for a physical device.

#### 4. Project Structure
```
design_full/
├── backend/
│   ├── api/
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   ├── manage.py
│   ├── design_full/
│   │   ├── settings.py
│   │   ├── urls.py
├── frontend/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── BookingScreen.tsx
│   │   │   ├── DesignDetails.tsx
│   │   ├── AppNavigator.tsx
│   ├── package.json
│   ├── tsconfig.json
├── README.md
```

---

## 🎉 How to Use DesignSphere

1. **Browse Designs**: Open the app and scroll through the Instagram-like feed. Ooh, shiny! ✨
2. **Book a Design**: Tap a post’s title, price, description, or the snazzy "Book Now" button to jump to the booking page. Fill in the details and hit confirm. Done! 🎯
3. **Check Details**: Tap the designer’s profile or image to dive into design details. Curious much? 🧐
4. **Like & Share**: Heart a design or share it with your crew. Spread the love! ❤️
5. **Get Notified**: Designers, keep an eye on notifications for new bookings. Cha-ching! 💸

---

## 🐛 Troubleshooting

- **API Issues**:
  - **401 Unauthorized**: Ensure the token in `HomeScreen.tsx` and `BookingScreen.tsx` matches a `client` user’s token.
    ```python
    print(Token.objects.get(user__username='testclient').key)
    ```
  - **404 Not Found**: Check `backend/api/urls.py` for `api/bookings/` and `api/designs/`.
- **TypeScript Errors**:
  - Run `npx tsc` to catch errors. Ensure files are `.tsx` (e.g., `HomeScreen.tsx`).
  - Missing types? Install:
    ```bash
    npm install --save-dev @types/react @types/react-native
    ```
- **BVLinearGradient Error**:
  - Replace `LinearGradient` with `View` in `HomeScreen.tsx` or `BookingScreen.tsx`:
    ```typescript
    <View style={styles.bookButtonGradient}>
      <Text style={styles.bookButtonText}>Book Now</Text>
    </View>
    ```
- **Images Not Loading**:
  - Ensure Django serves media files:
    ```python
    # backend/design_full/urls.py
    from django.conf import settings
    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    ```

Still stuck? Ping me in the GitHub issues or check the logs like a detective! 🕵️‍♂️

---

## 🤓 Tech Stack

- **Backend**: Django, Django REST Framework, Python 🐍
- **Frontend**: React Native, TypeScript, Expo 🚀
- **Database**: PostgreSQL (or SQLite for dev)
- **APIs**: RESTful endpoints for designs, bookings, and notifications
- **Styling**: Instagram-inspired with blue gradients and smooth animations 🌈

---

## 🙌 Contributing

Got ideas to make DesignSphere even cooler? Fork the repo, make your changes, and send a pull request. Let’s make the design world spin faster! 🌀

1. Fork the repo 🍴
2. Create a branch (`git checkout -b feature/awesome-idea`)
3. Commit your changes (`git commit -m "Added awesome idea"`)
4. Push to the branch (`git push origin feature/awesome-idea`)
5. Open a pull request and dance while it’s reviewed! 💃

---

## 📜 License

This project is licensed under the MIT License—free as a bird! 🐦 See [LICENSE](LICENSE) for details.

---

## 😎 About the Creator

Built by [MohamadKamardin1](https://github.com/MohamadKamardin1), a coding wizard who believes design and tech can make the world a prettier place. Got questions? Drop an issue or slide into the GitHub DMs! 😜

**DesignSphere**: Where creativity meets bookings, and everyone leaves with a smile! 😄