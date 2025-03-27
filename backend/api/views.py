from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
from rest_framework.views import APIView
from rest_framework.response import Response
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv

load_dotenv()

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
    def perform_create(self, serializer):
        tags = self.request.data.get('tags', '')
        if isinstance(tags, list):
            tags = ', '.join(tags)
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else: 
            print(serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class AINoteView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]  # Ensure only logged-in users can access

    def post(self, request):
        content = request.data.get("content")

        if not content:
            return Response({"error": "Missing note content"}, status=400)

        try:
            model = ChatOpenAI(model="llama3-8b-8192", temperature=0.8)
            prompt = ChatPromptTemplate.from_template(
                "Analyze the following note and return ONLY 3 relevant tags as a comma-separated list, without any additional text or explanation:\n{note}"
            )
            chain = prompt | model
            result = chain.invoke({"note": content})

            return Response({"tags": result.content})
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    