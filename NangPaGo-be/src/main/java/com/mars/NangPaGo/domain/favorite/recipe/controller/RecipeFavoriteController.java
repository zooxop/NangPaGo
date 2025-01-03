package com.mars.NangPaGo.domain.favorite.recipe.controller;

import com.mars.NangPaGo.common.dto.ResponseDto;
import com.mars.NangPaGo.domain.favorite.recipe.dto.RecipeFavoriteRequestDto;
import com.mars.NangPaGo.domain.favorite.recipe.dto.RecipeFavoriteResponseDto;
import com.mars.NangPaGo.domain.favorite.recipe.service.RecipeFavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/recipe")
public class RecipeFavoriteController {

    private final RecipeFavoriteService recipeFavoriteService;

    @GetMapping("/{id}/favorite/status")
    public ResponseEntity<Boolean> isFavorite(@RequestParam("email") String email, @PathVariable("id") Long id) {
        return ResponseEntity.ok(recipeFavoriteService.isFavoriteByUser(email, id));
    }

    @PostMapping("/{id}/favorite/toggle")
    public ResponseDto<RecipeFavoriteResponseDto> toggleFavorite(@RequestBody RecipeFavoriteRequestDto requestDto) {
        return ResponseDto.of(recipeFavoriteService.toggleFavorite(requestDto), "즐겨찾기 이벤트 발생");
    }
}
