from django.shortcuts import render, HttpResponse

# Create your views here.
def index(request):
    return render(request, 'project/index.html')

def home(request):
    print("In home def of views.py")
    return render(request, 'project/home.json')

def condo(request):
    print("In condo def of views.py")
    return render(request, 'project/condo.json')

def rent(request):
    print("In rent def of views.py")
    return render(request, 'project/rent.json')
